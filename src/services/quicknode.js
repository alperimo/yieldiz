// Quicknode RPC & Data Service
// Provides Solana RPC connection and real-time WebSocket subscriptions
// Docs: https://www.quicknode.com/docs

const RPC_URL = import.meta.env.VITE_QUICKNODE_RPC_URL || 'https://api.devnet.solana.com';
const WSS_URL = import.meta.env.VITE_QUICKNODE_WSS_URL || 'wss://api.devnet.solana.com';

export async function rpcCall(method, params = []) {
  const res = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  });
  if (!res.ok) throw new Error(`RPC error: ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.result;
}

export async function getBalance(address) {
  const result = await rpcCall('getBalance', [address]);
  return result.value / 1e9; // lamports → SOL
}

export async function getTokenAccounts(ownerAddress) {
  const result = await rpcCall('getTokenAccountsByOwner', [
    ownerAddress,
    { programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' },
    { encoding: 'jsonParsed' },
  ]);
  return result.value.map((account) => ({
    pubkey: account.pubkey,
    mint: account.account.data.parsed.info.mint,
    amount: account.account.data.parsed.info.tokenAmount.uiAmount,
    decimals: account.account.data.parsed.info.tokenAmount.decimals,
  }));
}

export async function getRecentPriorityFees() {
  const result = await rpcCall('getRecentPrioritizationFees', []);
  if (!result?.length) return { low: 1000, medium: 5000, high: 50000 };
  const fees = result.map((f) => f.prioritizationFee).sort((a, b) => a - b);
  return {
    low: fees[Math.floor(fees.length * 0.25)] || 1000,
    medium: fees[Math.floor(fees.length * 0.5)] || 5000,
    high: fees[Math.floor(fees.length * 0.75)] || 50000,
  };
}

export async function getTransaction(txHash) {
  return rpcCall('getTransaction', [txHash, { encoding: 'jsonParsed', maxSupportedTransactionVersion: 0 }]);
}

export function subscribeToAccount(address, callback) {
  const ws = new WebSocket(WSS_URL);
  let subId = null;

  ws.onopen = () => {
    ws.send(JSON.stringify({
      jsonrpc: '2.0', id: 1, method: 'accountSubscribe',
      params: [address, { encoding: 'jsonParsed', commitment: 'confirmed' }],
    }));
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id === 1) {
      subId = data.result;
    } else if (data.method === 'accountNotification') {
      callback(data.params.result);
    }
  };

  return () => {
    if (subId && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'accountUnsubscribe', params: [subId] }));
    }
    ws.close();
  };
}

export { RPC_URL, WSS_URL };
