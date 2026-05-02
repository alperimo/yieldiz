import { useState, useEffect, useCallback } from 'react';
import * as kamino from '../services/kamino';
import * as portfolioStore from '../services/portfolioStore';
import { useSupabase } from '../lib/useSupabase';
import { USE_MOCK_DATA } from '../lib/env';

const MOCK_TRANSACTIONS = [
  {
    id: 'tx-001',
    walletAddress: 'SoLg8t3RF1mBqJzPhdQfNkeFJb7ZqSxYhhvpA3oVZmp',
    type: 'deposit',
    status: 'confirmed',
    amount: 1000,
    token: 'USDC',
    fromChain: 'ethereum',
    toChain: 'solana',
    txHash: '5kYmZ8R4hJDnPtVJgRFnTVbMQD6K1qLPfCaKEvR3ZABC',
    metadata: { vaultName: 'USDC Multiply', apy: 8.2 },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'tx-002',
    walletAddress: 'SoLg8t3RF1mBqJzPhdQfNkeFJb7ZqSxYhhvpA3oVZmp',
    type: 'bridge',
    status: 'confirmed',
    amount: 1000,
    token: 'USDC',
    fromChain: 'ethereum',
    toChain: 'solana',
    txHash: '0xa3f9b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0',
    metadata: { bridge: 'Stargate', route: 'LI.FI' },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000 - 60000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'tx-003',
    walletAddress: 'SoLg8t3RF1mBqJzPhdQfNkeFJb7ZqSxYhhvpA3oVZmp',
    type: 'deposit',
    status: 'confirmed',
    amount: 2230,
    token: 'USDC',
    fromChain: 'arbitrum',
    toChain: 'solana',
    txHash: '3xPqR7sKdVnWY5tNGhBcME9jQZFw8L2UvACpXS1TDEF1',
    metadata: { vaultName: 'SOL-USDC LP', apy: 12.1 },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'tx-004',
    walletAddress: 'SoLg8t3RF1mBqJzPhdQfNkeFJb7ZqSxYhhvpA3oVZmp',
    type: 'bridge',
    status: 'pending',
    amount: 500,
    token: 'USDC',
    fromChain: 'base',
    toChain: 'solana',
    txHash: '0xd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4',
    metadata: { bridge: 'Across', route: 'LI.FI' },
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
];

export function useTransactions(walletAddress) {
  const { supabase, isAuthenticated } = useSupabase();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(async () => {
    if (!walletAddress) {
      setData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (USE_MOCK_DATA) {
        await new Promise((r) => setTimeout(r, 400));
        setData(MOCK_TRANSACTIONS.filter((t) => t.walletAddress === walletAddress));
      } else {
        if (isAuthenticated && supabase) {
          const stored = await portfolioStore.getStoredTransactions(supabase, walletAddress);
          if (stored.length) {
            setData(stored);
            return;
          }
        }
        const txs = await kamino.getUserTransactions(walletAddress);
        setData(txs);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, supabase, walletAddress]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  return { data, loading, error, refetch: fetchTransactions };
}
