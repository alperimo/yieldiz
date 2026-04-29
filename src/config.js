const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.eitherway.ai';

export const PROXY_API = (url) => `${API_BASE_URL}/api/proxy-api?url=${encodeURIComponent(url)}`;
export const PROXY_CDN = (url) => `${API_BASE_URL}/api/proxy-cdn?url=${encodeURIComponent(url)}`;
export const DIALECT_PROXY = `${API_BASE_URL}/api/dialect`;

export const COINGECKO_PRICE_URL = 'https://api.coingecko.com/api/v3/simple/price';
export const DEXSCREENER_URL = 'https://api.dexscreener.com/latest/dex';

export const TOKENS = {
  SOL: { symbol: 'SOL', name: 'Solana', color: '#D6A84F', decimals: 9 },
  USDC: { symbol: 'USDC', name: 'USD Coin', color: '#2775CA', decimals: 6 },
  mSOL: { symbol: 'mSOL', name: 'Marinade SOL', color: '#308D86', decimals: 9 },
  JTO: { symbol: 'JTO', name: 'Jito', color: '#45BF6F', decimals: 9 },
  BONK: { symbol: 'BONK', name: 'Bonk', color: '#F2A93B', decimals: 5 },
  JUP: { symbol: 'JUP', name: 'Jupiter', color: '#38BDF8', decimals: 6 },
  RAY: { symbol: 'RAY', name: 'Raydium', color: '#6DDFCD', decimals: 6 },
  PYTH: { symbol: 'PYTH', name: 'Pyth Network', color: '#E6DAFE', decimals: 6 },
  WIF: { symbol: 'WIF', name: 'dogwifhat', color: '#D4A574', decimals: 6 },
  ORCA: { symbol: 'ORCA', name: 'Orca', color: '#FFD15C', decimals: 6 },
  DFL: { symbol: 'DFL', name: 'DFlow', color: '#00D4AA', decimals: 6 },
};

export const CHAINS = [
  { id: 'solana', name: 'Solana', icon: '◎' },
  { id: 'ethereum', name: 'Ethereum', icon: 'Ξ' },
  { id: 'polygon', name: 'Polygon', icon: '⬡' },
  { id: 'arbitrum', name: 'Arbitrum', icon: '△' },
];

export const formatUsd = (n) => {
  if (n == null) return '$0.00';
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(2)}K`;
  return `$${Number(n).toFixed(2)}`;
};

export const formatPercent = (n) => {
  if (n == null) return '0.00%';
  return `${Number(n) >= 0 ? '+' : ''}${Number(n).toFixed(2)}%`;
};

export const shortenAddress = (addr) => {
  if (!addr) return '';
  return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
};
