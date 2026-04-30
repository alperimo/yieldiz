import { useCallback, useEffect, useState } from 'react';
import * as palmusd from '../services/palmusd';

const CACHE_MS = 5 * 60 * 1000;
let circulationCache = null;

export function usePalmUsdCirculation({ enabled = true } = {}) {
  const [data, setData] = useState(circulationCache?.data || null);
  const [loading, setLoading] = useState(enabled && !circulationCache);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!enabled) return null;
    if (circulationCache && Date.now() - circulationCache.timestamp < CACHE_MS) {
      setData(circulationCache.data);
      return circulationCache.data;
    }

    setLoading(true);
    setError(null);
    try {
      const payload = await palmusd.getCirculation();
      const normalized = palmusd.normalizeCirculation(payload);
      circulationCache = { data: normalized, timestamp: Date.now() };
      setData(normalized);
      return normalized;
    } catch (err) {
      setError(err.message);
      setData(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    refetch().catch(() => {});
  }, [enabled, refetch]);

  return { data, loading, error, refetch };
}
