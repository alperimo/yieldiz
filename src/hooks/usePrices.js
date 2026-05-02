import { useState, useEffect, useCallback } from 'react';
import { USE_MOCK_DATA } from '../lib/env';

// CoinGecko ID mapping
const COINGECKO_IDS = {
  SOL: 'solana',
  USDC: 'usd-coin',
  USDT: 'tether',
  ETH: 'ethereum',
  JitoSOL: 'jito-staked-sol',
  mSOL: 'msol',
};

const MOCK_PRICES = {
  SOL: { usd: 148.50, usd_24h_change: 3.2 },
  USDC: { usd: 1.00, usd_24h_change: 0.01 },
  USDT: { usd: 1.00, usd_24h_change: -0.02 },
  ETH: { usd: 3420.00, usd_24h_change: 1.8 },
  JitoSOL: { usd: 162.35, usd_24h_change: 3.5 },
  mSOL: { usd: 170.20, usd_24h_change: 3.1 },
};

export function usePrices(symbols = ['SOL', 'USDC', 'USDT']) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPrices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (USE_MOCK_DATA) {
        await new Promise((r) => setTimeout(r, 300));
        const prices = {};
        symbols.forEach((s) => { if (MOCK_PRICES[s]) prices[s] = MOCK_PRICES[s]; });
        setData(prices);
        return;
      }

      // Real: fetch from CoinGecko (free, no API key)
      const ids = symbols
        .map((s) => COINGECKO_IDS[s])
        .filter(Boolean)
        .join(',');

      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
        { headers: { Accept: 'application/json' } }
      );

      if (!res.ok) throw new Error(`Price API error: ${res.status}`);
      const raw = await res.json();

      const prices = {};
      symbols.forEach((symbol) => {
        const geckoId = COINGECKO_IDS[symbol];
        if (geckoId && raw[geckoId]) {
          prices[symbol] = {
            usd: raw[geckoId].usd,
            usd_24h_change: raw[geckoId].usd_24h_change || 0,
          };
        }
      });
      setData(prices);
    } catch (err) {
      setError(err.message);
      // Fall back to mock prices on API failure
      const prices = {};
      symbols.forEach((s) => { if (MOCK_PRICES[s]) prices[s] = MOCK_PRICES[s]; });
      setData(prices);
    } finally {
      setLoading(false);
    }
  }, [symbols.join(',')]);

  useEffect(() => { fetchPrices(); }, [fetchPrices]);

  return { data, loading, error, refetch: fetchPrices };
}
