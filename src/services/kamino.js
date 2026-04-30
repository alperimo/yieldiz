// Kamino Vault Service
// Docs: https://kamino.com/docs/build/developers/overview

const KAMINO_API = 'https://api.kamino.finance';

const TOKEN_BY_MINT = {
  EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: {
    symbol: 'USDC',
    depositToken: 'USDC',
    riskLevel: 'low',
  },
  Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB: {
    symbol: 'USDT',
    depositToken: 'USDT',
    riskLevel: 'low',
  },
  So11111111111111111111111111111111111111112: {
    symbol: 'SOL',
    depositToken: 'SOL',
    riskLevel: 'medium',
  },
  USDSwr9ApdHk5bvJKMjzff41FfuX8bSxdKcR81vTwcA: {
    symbol: 'USDS',
    depositToken: 'USDS',
    riskLevel: 'low',
  },
  '2u1tszSeqZ3qBWF3uNGPFc8TzMk2tdiwknnRMWGWjGWH': {
    symbol: 'USDG',
    depositToken: 'USDG',
    riskLevel: 'low',
  },
  CASHx9KJUStyftLFWGvEVf59SGeG9sh5FfcnZMVPCASH: {
    symbol: 'CASH',
    depositToken: 'CASH',
    riskLevel: 'low',
  },
  '2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo': {
    symbol: 'PYUSD',
    depositToken: 'PYUSD',
    riskLevel: 'low',
  },
};

const CURATED_VAULTS = new Set([
  'HDsayqAsDWy3QvANGqh2yNraqcD8Fnjgh73Mhb3WRS5E', // Steakhouse USDC
  'BEEfo7xwgK2ZP13Pxo7qqTPzAteKJmXjVWtMWcXSvbn2', // Steakhouse High Yield USDC
  'EPC2N3AAv84P9TKsnDt2x41p6T7c5vTewBhQbh4RVx4r', // MEV Capital USDC
  'A1USdT5BhSBpWiH4W6oZeykCDr9vq56qXVkMFhZjN48o', // Allez USDT
  'GFXX24s8VKbyxtQMx7pUDmK2sMFCnorQhtKuVoGqEdTZ', // Elemental USDT Optimizer
  '5SGXWx2fX6bvkqipCciT3TYzKVPJXU1Ww7kLkeUhJfaC', // Core++ USDT Vault
  'A1USdsC4kypCgPw5dHAwmqDjfFKrtdVHtXLhDY9QvHQ3', // Allez USDS
  '8wDtedCoYq2dH9UT1CoDC21v6kPHe32UNydhcvA8U9VS', // Elemental USDS Optimizer
  'A2wsxhA7pF4B2UKVfXocb6TAAP9ipfPJam6oMKgDE5BK', // Sentora PYUSD
  'BoZDRc1RDY9FzUZZ19WT4GbtTnnbXQ8AGSU5ByEw3ut5', // Steakhouse High Yield USDG
  'DJbRxuBckoJpFVUNtWx94NghcthfGaRV5NRmEazUaddE', // Elemental USDG Optimizer
  'A1so1bPD3W1TfeFwboDh8yfAAVaVtcdAYBYCjhg2mJQ', // Allez SOL
]);

const parseNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const selectApy = (metrics) => {
  const candidates = [
    metrics?.apy,
    metrics?.apyActual,
    metrics?.apyTheoretical,
    metrics?.apy7d,
    metrics?.apy30d,
  ].map(parseNumber);

  const apy = candidates.find((value) => value > 0) ?? 0;
  return apy > 1 ? apy : apy * 100;
};

const selectTvl = (metrics, state) => {
  const metricsTvl = parseNumber(metrics?.tokensAvailableUsd) + parseNumber(metrics?.tokensInvestedUsd);
  if (metricsTvl > 0) return metricsTvl;
  return parseNumber(state?.prevAum);
};

const describeVault = (name, token) => {
  if (/high yield|max yield|optimizer|turbo/i.test(name)) {
    return `Live Kamino ${token} strategy optimized for higher market-driven lending yield.`;
  }
  if (/private credit|rwa/i.test(name)) {
    return `Live Kamino ${token} vault with private-credit oriented allocation.`;
  }
  return `Live Kamino ${token} vault with APY and TVL pulled directly from Kamino.`;
};

const normalizeVault = (vault, metrics = {}) => {
  const state = vault?.state ?? {};
  const tokenMeta = TOKEN_BY_MINT[state.tokenMint] ?? {
    symbol: 'UNKNOWN',
    depositToken: 'USDC',
    riskLevel: 'medium',
  };
  const name = state.name?.trim() || `${tokenMeta.symbol} Vault`;
  const apy = selectApy(metrics);
  const tvl = selectTvl(metrics, state);

  return {
    pubkey: vault.address,
    address: vault.address,
    name,
    token: tokenMeta.symbol,
    depositToken: tokenMeta.depositToken,
    tokenMint: state.tokenMint,
    apy,
    tvl,
    riskLevel: tokenMeta.riskLevel,
    description: describeVault(name, tokenMeta.symbol),
    metrics,
    updatedAt: new Date().toISOString(),
  };
};

const fetchJson = async (path, options) => {
  const res = await fetch(`${KAMINO_API}${path}`, options);
  if (!res.ok) throw new Error(`Kamino API error ${res.status} for ${path}`);
  return res.json();
};

export async function getEarnVaults() {
  const rawVaults = await fetchJson('/kvaults/vaults');
  const curated = rawVaults.filter((vault) => CURATED_VAULTS.has(vault.address));

  if (!curated.length) {
    throw new Error('Kamino API returned no curated SolGate vaults');
  }

  const settled = await Promise.allSettled(
    curated.map(async (vault) => {
      const metrics = await getVaultMetrics(vault.address);
      return normalizeVault(vault, metrics);
    })
  );

  const vaults = settled
    .filter((result) => result.status === 'fulfilled')
    .map((result) => result.value)
    .sort((a, b) => {
      const tokenPriority = (token) => ({ USDC: 0, USDT: 1, USDS: 2, USDG: 3, PYUSD: 4, SOL: 5 }[token] ?? 9);
      const priorityDiff = tokenPriority(a.token) - tokenPriority(b.token);
      if (priorityDiff !== 0) return priorityDiff;
      return b.tvl - a.tvl;
    });

  const failedCount = settled.length - vaults.length;
  if (failedCount > 0) {
    console.warn(`Kamino metrics unavailable for ${failedCount} curated vault(s)`);
  }

  if (!vaults.length) {
    const reason = settled.find((result) => result.status === 'rejected')?.reason;
    throw new Error(reason?.message || 'Kamino metrics unavailable for curated SolGate vaults');
  }

  return vaults;
}

export async function getVaultMetrics(vaultAddress) {
  if (!vaultAddress) throw new Error('Kamino vault address is required');
  return fetchJson(`/kvaults/vaults/${encodeURIComponent(vaultAddress)}/metrics`);
}

export async function getUserPositions(userAddress) {
  if (!userAddress) throw new Error('Kamino user address is required');
  return fetchJson(`/kvaults/users/${encodeURIComponent(userAddress)}/positions`);
}

export async function getUserTransactions(userAddress) {
  if (!userAddress) throw new Error('Kamino user address is required');
  return fetchJson(`/kvaults/users/${encodeURIComponent(userAddress)}/transactions`);
}

export async function buildVaultDeposit({ vaultAddress, amount, ownerAddress }) {
  const res = await fetch(`${KAMINO_API}/ktx/kvault/deposit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      vault: vaultAddress,
      amount: String(amount),
      owner: ownerAddress,
    }),
  });
  if (!res.ok) throw new Error(`Kamino deposit error: ${res.status}`);
  return res.json();
}

export async function buildVaultWithdraw({ vaultAddress, shares, ownerAddress }) {
  const res = await fetch(`${KAMINO_API}/ktx/kvault/withdraw`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      vault: vaultAddress,
      shares: String(shares),
      owner: ownerAddress,
    }),
  });
  if (!res.ok) throw new Error(`Kamino withdraw error: ${res.status}`);
  return res.json();
}
