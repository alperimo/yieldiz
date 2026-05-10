const rawUseMockData = import.meta.env.VITE_USE_MOCK_DATA;

export const DEMO_MODE =
  !import.meta.env.PROD && import.meta.env.VITE_DEMO_MODE === 'true';

export const USE_MOCK_DATA =
  DEMO_MODE ||
  rawUseMockData === 'true' ||
  (!import.meta.env.PROD && rawUseMockData !== 'false');

export const SHOW_DEMO_DASHBOARD =
  DEMO_MODE ||
  (!import.meta.env.PROD && import.meta.env.VITE_SHOW_DEMO_DASHBOARD === 'true');

export const DEMO_WALLET_ADDRESS = 'SoLg8t3RF1mBqJzPhdQfNkeFJb7ZqSxYhhvpA3oVZmp';
export const DEMO_EVM_ADDRESS = '0x7E1d5A9B3c4F6a8D2e0B1C3A5F7D9E2B4C6A8D0F';
export const DEMO_SOURCE_CHAIN = 'ethereum';
export const DEMO_SOURCE_TOKEN = 'USDT';
export const DEMO_DEPOSIT_AMOUNT = '10000';
export const DEMO_SOURCE_BALANCES = {
  USDC: 42000,
  USDT: 18500,
  PUSD: 12000,
  USDG: 9500,
};
