import { useState, useEffect, useCallback } from 'react';
import * as kamino from '../services/kamino';
import * as portfolioStore from '../services/portfolioStore';
import * as demoPortfolio from '../services/demoPortfolio';
import { useSupabase } from '../lib/useSupabase';
import { DEMO_MODE, SHOW_DEMO_DASHBOARD, USE_MOCK_DATA } from '../lib/env';

export function usePositions(walletAddress) {
  const { supabase, isAuthenticated } = useSupabase();
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
      if (DEMO_MODE || USE_MOCK_DATA || SHOW_DEMO_DASHBOARD) {
        await new Promise((r) => setTimeout(r, 500));
        setData(demoPortfolio.getDemoPositions(walletAddress));
      } else {
        if (isAuthenticated && supabase) {
          const stored = await portfolioStore.getStoredPositions(supabase, walletAddress);
          if (stored.length) {
            setData(stored);
            return;
          }
        }
        const positions = await kamino.getUserPositions(walletAddress);
        setData(positions);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, supabase, walletAddress]);

  useEffect(() => { fetchPositions(); }, [fetchPositions]);

  return { data, loading, error, refetch: fetchPositions };
}
