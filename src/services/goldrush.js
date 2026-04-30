const GOLDRUSH_API = import.meta.env.VITE_GOLDRUSH_API_BASE || 'https://api.covalenthq.com';

export const GOLDRUSH_CHAIN_NAMES = {
  ethereum: 'eth-mainnet',
  arbitrum: 'arbitrum-mainnet',
  base: 'base-mainnet',
  optimism: 'optimism-mainnet',
  polygon: 'matic-mainnet',
  bnb: 'bsc-mainnet',
  solana: 'solana-mainnet',
};

function getApiKey() {
  return import.meta.env.VITE_GOLDRUSH_API_KEY || '';
}

export function isGoldRushConfigured() {
  return Boolean(getApiKey());
}

async function request(path, { searchParams } = {}) {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('Route confidence is unavailable until GoldRush is configured.');

  const params = new URLSearchParams(searchParams || {});
  const url = `${GOLDRUSH_API}${path}${params.size ? `?${params}` : ''}`;
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
  });

  const body = await res.json().catch(() => null);
  if (!res.ok || body?.error) {
    const message = body?.error_message || body?.error?.message || `GoldRush request failed (${res.status})`;
    throw new Error(message);
  }
  return body?.data || body;
}

export function getChainName(chain) {
  const chainName = GOLDRUSH_CHAIN_NAMES[chain];
  if (!chainName) throw new Error(`GoldRush does not support ${chain} in this route yet.`);
  return chainName;
}

export async function getTokenBalances({ chain, walletAddress }) {
  const chainName = getChainName(chain);
  return request(`/v1/${chainName}/address/${walletAddress}/balances_v2/`);
}

export async function getRecentTransactions({ chain, walletAddress, page = 0 }) {
  const chainName = getChainName(chain);
  const suffix = page > 0 ? `/page/${page}/` : '/';
  return request(`/v1/${chainName}/address/${walletAddress}/transactions_v3${suffix}`);
}

export async function getApprovals({ chain, walletAddress }) {
  const chainName = getChainName(chain);
  return request(`/v1/${chainName}/approvals/${walletAddress}/`);
}

export function createRouteConfidence({ balances, transactions, approvals, tokenSymbol }) {
  const items = Array.isArray(balances?.items) ? balances.items : [];
  const txItems = Array.isArray(transactions?.items) ? transactions.items : [];
  const approvalItems = Array.isArray(approvals?.items) ? approvals.items : [];
  const matchingBalance = items.find((item) => item.contract_ticker_symbol === tokenSymbol);
  const highRiskApprovals = approvalItems.flatMap((item) => item.spenders || []).filter((spender) => {
    const risk = String(spender.risk_factor || '').toLowerCase();
    return risk === 'high' || Number(spender.value_at_risk_quote || 0) > 1000;
  });

  return {
    balanceFound: Boolean(matchingBalance),
    balanceQuote: Number(matchingBalance?.quote || 0),
    recentTransactionCount: txItems.length,
    highRiskApprovalCount: highRiskApprovals.length,
    checkedAt: new Date().toISOString(),
    status: highRiskApprovals.length ? 'review' : 'ready',
  };
}

