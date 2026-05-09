import { useState, useCallback } from 'react';
import * as lifi from '../services/lifi';
import { SUPPORTED_CHAINS } from '../services/lifi';
import { USE_MOCK_DATA } from '../lib/env';
import { applyPlatformFeeToQuote } from '../lib/monetization';
import { getSolanaMint, getStablecoin, getTokenAddress, toBaseUnits } from '../lib/stablecoins';

const MOCK_ROUTES = {
  ethereum: { route: 'Stargate', estimatedTime: 30, bridgeFee: 0.80, networkFee: 0.45 },
  arbitrum: { route: 'Across', estimatedTime: 15, bridgeFee: 0.35, networkFee: 0.12 },
  base: { route: 'Across', estimatedTime: 12, bridgeFee: 0.25, networkFee: 0.08 },
  polygon: { route: 'Stargate', estimatedTime: 25, bridgeFee: 0.60, networkFee: 0.02 },
  optimism: { route: 'Across', estimatedTime: 18, bridgeFee: 0.40, networkFee: 0.10 },
  solana: { route: 'Direct', estimatedTime: 2, bridgeFee: 0, networkFee: 0.005 },
};

export function useBridgeQuote() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getQuote = useCallback(async ({ fromChain, fromToken = 'USDC', toChain, toToken = 'USDC', amount, fromAddress, toAddress }) => {
    if (!fromChain || !amount || Number(amount) <= 0) {
      setData(null);
      setError(null);
      return;
    }

    const sourceToken = getStablecoin(fromToken);
    const destinationMint = getSolanaMint(toToken);
    if (!sourceToken || !destinationMint) {
      setError('This stablecoin route is not available yet.');
      setData(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (USE_MOCK_DATA || fromChain === 'solana') {
        // Mock mode or same-chain (no bridge needed)
        const routeInfo = MOCK_ROUTES[fromChain] || MOCK_ROUTES.ethereum;
        const totalFees = routeInfo.bridgeFee + routeInfo.networkFee;
        const toAmount = Number(amount) - totalFees;

        setData(applyPlatformFeeToQuote({
          fromChain,
          toChain: toChain || 'solana',
          fromToken,
          toToken,
          fromAmount: Number(amount),
          toAmount: Math.max(0, toAmount),
          estimatedTime: routeInfo.estimatedTime,
          bridgeFee: routeInfo.bridgeFee,
          networkFee: routeInfo.networkFee,
          route: routeInfo.route,
          rawRoute: null,
          steps: [
            ...(fromChain !== 'solana' ? [{
              type: 'bridge',
              description: `Bridge ${fromToken || 'USDC'}: ${fromChain} → Solana (LI.FI)`,
              estimatedTime: routeInfo.estimatedTime,
              protocol: `LI.FI / ${routeInfo.route}`,
            }] : []),
            ...(fromToken !== toToken ? [{
              type: 'swap',
              description: `Convert ${fromToken} to ${toToken}`,
              estimatedTime: 2,
              protocol: 'DFlow',
            }] : []),
            {
              type: 'deposit',
              description: 'Deposit into Kamino Vault',
              estimatedTime: 2,
              protocol: 'Kamino',
            },
          ],
        }));
        return;
      }

      // Real LI.FI quote
      const chainId = SUPPORTED_CHAINS[fromChain];
      if (!chainId) throw new Error(`Unsupported chain: ${fromChain}`);
      if (!fromAddress) {
        setData(null);
        setError('Connect an EVM wallet to fetch a live LI.FI quote for this route.');
        return;
      }
      if (!toAddress) {
        setData(null);
        setError('Connect your Solana wallet to receive the live route quote.');
        return;
      }

      const fromTokenAddr = getTokenAddress(fromToken, fromChain);
      if (!fromTokenAddr) throw new Error(`${fromToken} is not available on ${fromChain} in Yieldiz yet.`);

      const amountInBaseUnits = toBaseUnits(amount, sourceToken.decimals);

      const result = await lifi.getBridgeQuote({
        fromChainId: chainId,
        fromToken: fromTokenAddr,
        toToken: destinationMint,
        fromAmount: amountInBaseUnits,
        fromAddress,
        toAddress,
      });

      // Parse LI.FI response into our format
      const estimatedOutput = Number(result.estimatedOutput) / 1e6; // USDC back to human
      const totalBridgeFee = (result.bridgeFee || []).reduce((sum, f) => sum + Number(f.amountUSD || 0), 0);
      const totalGasCost = (result.gasCost || []).reduce((sum, g) => sum + Number(g.amountUSD || 0), 0);

      const quote = applyPlatformFeeToQuote({
        fromChain,
        toChain: 'solana',
        fromToken,
        toToken,
        fromAmount: Number(amount),
        toAmount: estimatedOutput || Number(amount) - totalBridgeFee - totalGasCost,
        estimatedTime: result.estimatedTime || 30,
        bridgeFee: totalBridgeFee,
        networkFee: totalGasCost,
        route: result.route?.tool || 'LI.FI',
        rawRoute: result.route,
        steps: [
          {
            type: 'bridge',
            description: `Move ${fromToken}: ${fromChain} → Solana`,
            estimatedTime: result.estimatedTime || 30,
            protocol: `LI.FI / ${result.route?.tool || 'Best Route'}`,
          },
          ...(fromToken !== toToken ? [{
            type: 'swap',
            description: `Convert ${fromToken} to ${toToken}`,
            estimatedTime: 2,
            protocol: 'DFlow',
          }] : []),
          {
            type: 'deposit',
            description: 'Deposit into Kamino Vault',
            estimatedTime: 2,
            protocol: 'Kamino',
          },
        ],
      });

      setData(quote);
    } catch (err) {
      setError(err.message);
      if (!USE_MOCK_DATA) {
        setData(null);
        return;
      }
      const routeInfo = MOCK_ROUTES[fromChain] || MOCK_ROUTES.ethereum;
      const totalFees = routeInfo.bridgeFee + routeInfo.networkFee;
      setData(applyPlatformFeeToQuote({
        fromChain,
        toChain: 'solana',
        fromToken,
        toToken,
        fromAmount: Number(amount),
        toAmount: Math.max(0, Number(amount) - totalFees),
        estimatedTime: routeInfo.estimatedTime,
        bridgeFee: routeInfo.bridgeFee,
        networkFee: routeInfo.networkFee,
        route: routeInfo.route,
        rawRoute: null,
        steps: [
          { type: 'bridge', description: `Move ${fromToken}: ${fromChain} → Solana`, estimatedTime: routeInfo.estimatedTime, protocol: `LI.FI / ${routeInfo.route}` },
          { type: 'deposit', description: 'Deposit into Kamino Vault', estimatedTime: 2, protocol: 'Kamino' },
        ],
      }));
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, getQuote };
}
