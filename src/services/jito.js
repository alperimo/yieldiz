// Jito MEV Protection Service
// Wraps swap + deposit transactions in Jito Bundles for atomic execution
// Docs: https://docs.jito.wtf

const BLOCK_ENGINE_URL = import.meta.env.VITE_JITO_BLOCK_ENGINE_URL || 'mainnet.block-engine.jito.wtf';
const JITO_BUNDLE_API = `https://${BLOCK_ENGINE_URL}/api/v1/bundles`;

// Jito tip accounts (official)
const TIP_ACCOUNTS = [
  '96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nmNhvrZU5',
  'HFqU5x63VTqvQss8hp11i4bVqkfRtQ7NmXwkiNPnYnJ6',
  'Cw8CFyM9FkoMi7K7Crf6HNQqf4uEMzpKw6QNghXLvLkY',
  'ADaUMid9yfUytqMBgopwjb2DTLSLhfKS3Ebka8ifiRAw',
  'DfXygSm4jCyNCybVYYK6DwvWqjKee8pbDmJGcLWNDXjh',
  'ADuUkR4vqLUMWXxW9gh6D6L8pMSawimctcNZ5pGwDcEt',
  'DttWaMuVvTiduZRnguLF7jNxTgiMBZ1hyAumKUiL2KRL',
  '3AVi9Tg9Uo68tJfuvoKvqKNWKkC5wPdSSdeBnizKZ6jT',
];

function getRandomTipAccount() {
  return TIP_ACCOUNTS[Math.floor(Math.random() * TIP_ACCOUNTS.length)];
}

export async function sendBundle(serializedTransactions, tipLamports = 10000) {
  const res = await fetch(JITO_BUNDLE_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'sendBundle',
      params: [serializedTransactions],
    }),
  });
  if (!res.ok) throw new Error(`Jito bundle error: ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.result;
}

export async function getBundleStatus(bundleId) {
  const res = await fetch(JITO_BUNDLE_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'getBundleStatuses',
      params: [[bundleId]],
    }),
  });
  if (!res.ok) throw new Error(`Jito status error: ${res.status}`);
  const data = await res.json();
  return data.result?.value?.[0] ?? null;
}

export { getRandomTipAccount, TIP_ACCOUNTS, BLOCK_ENGINE_URL };
