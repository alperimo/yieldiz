// LI.FI Cross-Chain Bridge Service
// Enables deposits from EVM chains (Ethereum, Arbitrum, Base, Polygon, Optimism) to Solana
// Docs: https://docs.li.fi/integrate-li.fi-sdk/li.fi-sdk-overview

const LIFI_API = 'https://li.quest/v1';
const SOLANA_CHAIN_ID = 1151111081099710;

// Supported EVM chains for bridging to Solana
export const SUPPORTED_CHAINS = {
  ethereum: 1,
  arbitrum: 42161,
  base: 8453,
  optimism: 10,
  polygon: 137,
};

async function readLifiError(res, fallbackLabel) {
  try {
    const body = await res.json();
    const message = body?.message || body?.error?.message || body?.error || fallbackLabel;
    const code = body?.code ? ` (${body.code})` : '';
    return `${fallbackLabel}: ${message}${code}`;
  } catch {
    return `${fallbackLabel}: ${res.status}`;
  }
}

export async function getBridgeQuote({ fromChainId, fromToken, toToken, fromAmount, fromAddress, toAddress }) {
  const params = new URLSearchParams({
    fromChain: String(fromChainId),
    toChain: String(SOLANA_CHAIN_ID),
    fromToken,
    toToken,
    fromAmount: String(fromAmount),
    fromAddress,
    toAddress,
    integrator: import.meta.env.VITE_LIFI_INTEGRATOR || 'yieldiz',
  });

  const res = await fetch(`${LIFI_API}/quote?${params}`);
  if (!res.ok) throw new Error(await readLifiError(res, 'LI.FI quote error'));
  const quote = await res.json();

  return {
    estimatedTime: quote.estimate?.executionDuration ?? 0,
    estimatedOutput: quote.estimate?.toAmount ?? '0',
    bridgeFee: quote.estimate?.feeCosts ?? [],
    gasCost: quote.estimate?.gasCosts ?? [],
    route: quote,
  };
}

export async function getRoutes({ fromChainId, fromToken, toToken, fromAmount, fromAddress, toAddress }) {
  const res = await fetch(`${LIFI_API}/advanced/routes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fromChainId,
      toChainId: SOLANA_CHAIN_ID,
      fromTokenAddress: fromToken,
      toTokenAddress: toToken,
      fromAmount: String(fromAmount),
      fromAddress,
      toAddress,
      options: {
        integrator: import.meta.env.VITE_LIFI_INTEGRATOR || 'yieldiz',
        slippage: 0.005,
        order: 'RECOMMENDED',
      },
    }),
  });
  if (!res.ok) throw new Error(await readLifiError(res, 'LI.FI routes error'));
  return res.json();
}

export async function getChainTokens(chainId) {
  const res = await fetch(`${LIFI_API}/tokens?chains=${chainId}`);
  if (!res.ok) throw new Error(await readLifiError(res, 'LI.FI tokens error'));
  return res.json();
}

export async function getTransactionStatus(txHash, fromChain, toChain) {
  const params = new URLSearchParams({ txHash, fromChain: String(fromChain), toChain: String(toChain) });
  const res = await fetch(`${LIFI_API}/status?${params}`);
  if (!res.ok) throw new Error(await readLifiError(res, 'LI.FI status error'));
  return res.json();
}
