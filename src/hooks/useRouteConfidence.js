import { useCallback, useMemo, useState } from 'react';
import * as goldrush from '../services/goldrush';
import { USE_MOCK_DATA } from '../lib/env';

function createMockConfidence({ chain, tokenSymbol }) {
  const isEvmRoute = chain !== 'solana';

  return {
    status: 'ready',
    reason: `Demo ${tokenSymbol || 'stablecoin'} route confidence is clear.`,
    recentTransactionCount: isEvmRoute ? 18 : 7,
    highRiskApprovalCount: 0,
  };
}

export function useRouteConfidence() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const configured = useMemo(() => goldrush.isGoldRushConfigured(), []);

  const checkRoute = useCallback(async ({ chain, walletAddress, tokenSymbol }) => {
    if (!walletAddress || !chain) {
      const missingInput = {
        status: 'unavailable',
        reason: !walletAddress ? 'Connect the source wallet to check route confidence.' : 'Select a source chain to check route confidence.',
      };
      setData(missingInput);
      return missingInput;
    }

    if (USE_MOCK_DATA && !goldrush.isGoldRushConfigured()) {
      setLoading(true);
      setError(null);
      await new Promise((resolve) => setTimeout(resolve, 700));
      const confidence = createMockConfidence({ chain, tokenSymbol });
      setData(confidence);
      setLoading(false);
      return confidence;
    }

    if (!goldrush.isGoldRushConfigured()) {
      const unavailable = {
        status: 'unavailable',
        reason: 'Route confidence is available after GoldRush is configured.',
      };
      setData(unavailable);
      return unavailable;
    }

    setLoading(true);
    setError(null);
    try {
      const optional = (promise) => promise.catch(() => ({ items: [] }));
      const [balances, transactions, approvals] = await Promise.all([
        goldrush.getTokenBalances({ chain, walletAddress }),
        chain === 'solana'
          ? Promise.resolve({ items: [] })
          : optional(goldrush.getRecentTransactions({ chain, walletAddress })),
        chain === 'solana'
          ? Promise.resolve({ items: [] })
          : optional(goldrush.getApprovals({ chain, walletAddress })),
      ]);
      const confidence = goldrush.createRouteConfidence({ balances, transactions, approvals, tokenSymbol });
      setData(confidence);
      return confidence;
    } catch (err) {
      const failed = { status: 'error', reason: err.message };
      setError(err.message);
      setData(failed);
      return failed;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, configured, checkRoute };
}
