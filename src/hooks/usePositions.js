import { useState, useEffect, useCallback } from 'react';
import * as kamino from '../services/kamino';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

const MOCK_POSITIONS = [
  {
    id: 'pos-001',
    walletAddress: 'SoLg8t3RF1mBqJzPhdQfNkeFJb7ZqSxYhhvpA3oVZmp',
    vaultPubkey: 'ByYRio3rVhzEofPsckfCEfXgsWirHbgFkTKDMbMCHe4Z',
    vaultName: 'USDC Multiply',
    depositedAmount: 3000,
    depositedToken: 'USDC',
    sharesReceived: 2985.5,
    entryApy: 8.2,
    currentValue: 3028.40,
    earned: 28.40,
    txHash: '5kYmZ8R4hJDnPtVJgRFnTVbMQD6K1qLPfCaKEvR3ZABC',
    sourceChain: 'ethereum',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'pos-002',
    walletAddress: 'SoLg8t3RF1mBqJzPhdQfNkeFJb7ZqSxYhhvpA3oVZmp',
    vaultPubkey: '6LtLpnUFNByNXLyCoK9wA2MykKAmQNZKBdY8s47dehDc',
    vaultName: 'SOL-USDC LP',
    depositedAmount: 2230,
    depositedToken: 'USDC',
    sharesReceived: 2210.8,
    entryApy: 12.1,
    currentValue: 2243.78,
    earned: 13.78,
    txHash: '3xPqR7sKdVnWY5tNGhBcME9jQZFw8L2UvACpXS1TDEF1',
    sourceChain: 'arbitrum',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function usePositions(walletAddress) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPositions = useCallback(async () => {
    if (!walletAddress) {
      setData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 500));
        setData(MOCK_POSITIONS.filter((p) => p.walletAddress === walletAddress));
      } else {
        const positions = await kamino.getUserPositions(walletAddress);
        setData(positions);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => { fetchPositions(); }, [fetchPositions]);

  return { data, loading, error, refetch: fetchPositions };
}
