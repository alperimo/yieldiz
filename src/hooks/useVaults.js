import { useState, useEffect, useCallback } from 'react';
import * as kamino from '../services/kamino';
import { USE_MOCK_DATA } from '../lib/env';

const MOCK_VAULTS = [
  {
    pubkey: 'ByYRio3rVhzEofPsckfCEfXgsWirHbgFkTKDMbMCHe4Z',
    name: 'USDC Multiply',
    token: 'USDC',
    depositToken: 'USDC',
    apy: 8.2,
    tvl: 1_240_000,
    riskLevel: 'low',
    description: 'Earn yield on USDC through automated lending strategies on Kamino.',
  },
  {
    pubkey: '6LtLpnUFNByNXLyCoK9wA2MykKAmQNZKBdY8s47dehDc',
    name: 'SOL-USDC LP',
    token: 'SOL-USDC',
    depositToken: 'USDC',
    apy: 12.1,
    tvl: 890_000,
    riskLevel: 'medium',
    description: 'Concentrated liquidity position in SOL-USDC with auto-rebalancing.',
  },
  {
    pubkey: '2VmPFJ5zLTknMbCqToXS4LCDJiZpSsDDFqoKPxgsXFwi',
    name: 'JitoSOL Boost',
    token: 'JitoSOL',
    depositToken: 'SOL',
    apy: 9.4,
    tvl: 650_000,
    riskLevel: 'low',
    description: 'Leverage JitoSOL staking rewards with automated compounding.',
  },
  {
    pubkey: '3xB4sFPNbpjLqLmwPRLLyQxKpXmq7CmqCYKJ6jD9zX5',
    name: 'mSOL-SOL LP',
    token: 'mSOL-SOL',
    depositToken: 'SOL',
    apy: 6.8,
    tvl: 420_000,
    riskLevel: 'low',
    description: 'Stable pair liquidity with minimal impermanent loss risk.',
  },
  {
    pubkey: '8wFmKDE6T7QzYvRY3j9EHhRNqKBPFzAiNnLr6NTMPWjS',
    name: 'USDT Earn',
    token: 'USDT',
    depositToken: 'USDT',
    apy: 7.5,
    tvl: 560_000,
    riskLevel: 'low',
    description: 'Conservative USDT lending strategy with stable returns.',
  },
];

export function useVaults() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVaults = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (USE_MOCK_DATA) {
        await new Promise((r) => setTimeout(r, 600));
        setData(MOCK_VAULTS);
      } else {
        const vaults = await kamino.getEarnVaults();
        setData(vaults);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchVaults(); }, [fetchVaults]);

  return { data, loading, error, refetch: fetchVaults };
}
