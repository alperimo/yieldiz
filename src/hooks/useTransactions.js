import { useState, useEffect, useCallback } from 'react';
import * as kamino from '../services/kamino';
import * as portfolioStore from '../services/portfolioStore';
import * as demoPortfolio from '../services/demoPortfolio';
import { useSupabase } from '../lib/useSupabase';
import { SHOW_DEMO_DASHBOARD, USE_MOCK_DATA } from '../lib/env';

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
      if (USE_MOCK_DATA || SHOW_DEMO_DASHBOARD) {
        await new Promise((r) => setTimeout(r, 400));
        setData(demoPortfolio.getDemoTransactions(walletAddress));
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
