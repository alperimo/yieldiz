// Kamino Vault Service
// Connects to Kamino Finance REST API and KTX Transaction API
// Docs: https://kamino.com/docs/build/developers/overview

const KAMINO_API = 'https://api.kamino.finance';

export async function getEarnVaults() {
  const res = await fetch(`${KAMINO_API}/kvaults/vaults`);
  if (!res.ok) throw new Error(`Kamino API error: ${res.status}`);
  return res.json();
}

export async function getVaultMetrics(vaultAddress) {
  const res = await fetch(`${KAMINO_API}/kvaults/vaults/${encodeURIComponent(vaultAddress)}/metrics`);
  if (!res.ok) throw new Error(`Kamino metrics error: ${res.status}`);
  return res.json();
}

export async function getUserPositions(userAddress) {
  const res = await fetch(`${KAMINO_API}/kvaults/users/${encodeURIComponent(userAddress)}/positions`);
  if (!res.ok) throw new Error(`Kamino positions error: ${res.status}`);
  return res.json();
}

export async function getUserTransactions(userAddress) {
  const res = await fetch(`${KAMINO_API}/kvaults/users/${encodeURIComponent(userAddress)}/transactions`);
  if (!res.ok) throw new Error(`Kamino transactions error: ${res.status}`);
  return res.json();
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
