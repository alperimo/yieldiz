const rawUseMockData = import.meta.env.VITE_USE_MOCK_DATA;

export const USE_MOCK_DATA =
  rawUseMockData === 'true' ||
  (!import.meta.env.PROD && rawUseMockData !== 'false');

