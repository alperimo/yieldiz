import { useState, useCallback } from 'react';
import * as lifi from '../services/lifi';
import { SUPPORTED_CHAINS } from '../services/lifi';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

// Common stablecoin addresses per chain (native USDC)
const USDC_ADDRESSES = {
  1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',       // Ethereum
  42161: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',     // Arbitrum
  8453: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',      // Base
  10: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',        // Optimism
  137: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',       // Polygon
};

// Solana USDC mint address
const SOLANA_USDC = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

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

  const getQuote = useCallback(async ({ fromChain, fromToken, toChain, toToken, amount, fromAddress, toAddress }) => {
    if (!fromChain || !amount || Number(amount) <= 0) {
      setData(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (USE_MOCK || fromChain === 'solana') {
        // Mock mode or same-chain (no bridge needed)
        const routeInfo = MOCK_ROUTES[fromChain] || MOCK_ROUTES.ethereum;
        const totalFees = routeInfo.bridgeFee + routeInfo.networkFee;
        const toAmount = Number(amount) - totalFees;

        setData({
          fromChain,
          toChain: toChain || 'solana',
          fromToken: fromToken || 'USDC',
          toToken: toToken || 'USDC',
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
              description: 'Swap via DFlow (0% MEV)',
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
        return;
      }

      // Real LI.FI quote
      const chainId = SUPPORTED_CHAINS[fromChain];
      if (!chainId) throw new Error(`Unsupported chain: ${fromChain}`);

      const fromTokenAddr = USDC_ADDRESSES[chainId];
      if (!fromTokenAddr) throw new Error(`No USDC address for chain ${fromChain}`);

      const amountInBaseUnits = String(Math.floor(Number(amount) * 1e6)); // USDC has 6 decimals

      const result = await lifi.getBridgeQuote({
        fromChainId: chainId,
        fromToken: fromTokenAddr,
        toToken: SOLANA_USDC,
        fromAmount: amountInBaseUnits,
        fromAddress: fromAddress || '0x0000000000000000000000000000000000000000',
        toAddress: toAddress || '',
      });

      // Parse LI.FI response into our format
      const estimatedOutput = Number(result.estimatedOutput) / 1e6; // USDC back to human
      const totalBridgeFee = (result.bridgeFee || []).reduce((sum, f) => sum + Number(f.amountUSD || 0), 0);
      const totalGasCost = (result.gasCost || []).reduce((sum, g) => sum + Number(g.amountUSD || 0), 0);

      const quote = {
        fromChain,
        toChain: 'solana',
        fromToken: fromToken || 'USDC',
        toToken: toToken || 'USDC',
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
            description: `Bridge USDC: ${fromChain} → Solana (LI.FI)`,
            estimatedTime: result.estimatedTime || 30,
            protocol: `LI.FI / ${result.route?.tool || 'Best Route'}`,
          },
          ...(fromToken !== toToken ? [{
            type: 'swap',
            description: 'Swap via DFlow (0% MEV)',
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
      };

      setData(quote);
    } catch (err) {
      setError(err.message);
      // Fall back to mock on API error so UI stays functional
      const routeInfo = MOCK_ROUTES[fromChain] || MOCK_ROUTES.ethereum;
      const totalFees = routeInfo.bridgeFee + routeInfo.networkFee;
      setData({
        fromChain,
        toChain: 'solana',
        fromToken: fromToken || 'USDC',
        toToken: toToken || 'USDC',
        fromAmount: Number(amount),
        toAmount: Math.max(0, Number(amount) - totalFees),
        estimatedTime: routeInfo.estimatedTime,
        bridgeFee: routeInfo.bridgeFee,
        networkFee: routeInfo.networkFee,
        route: routeInfo.route,
        rawRoute: null,
        steps: [
          { type: 'bridge', description: `Bridge USDC: ${fromChain} → Solana (LI.FI)`, estimatedTime: routeInfo.estimatedTime, protocol: `LI.FI / ${routeInfo.route}` },
          { type: 'deposit', description: 'Deposit into Kamino Vault', estimatedTime: 2, protocol: 'Kamino' },
        ],
      });
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, getQuote };
}
