const rawUseMockData = import.meta.env.VITE_USE_MOCK_DATA;

export const USE_MOCK_DATA =
  rawUseMockData === 'true' ||
  (!import.meta.env.PROD && rawUseMockData !== 'false');

export const SHOW_DEMO_DASHBOARD =
  !import.meta.env.PROD && import.meta.env.VITE_SHOW_DEMO_DASHBOARD === 'true';

export const DEMO_WALLET_ADDRESS = 'SoLg8t3RF1mBqJzPhdQfNkeFJb7ZqSxYhhvpA3oVZmp';
