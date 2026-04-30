export const SOLANA_CHAIN_ID = 1151111081099710;

export const STABLECOINS = {
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    category: 'reserve-backed dollar',
    solanaMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    addresses: {
      ethereum: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      arbitrum: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      base: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      optimism: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
      polygon: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
      solana: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    },
  },
  USDT: {
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    category: 'reserve-backed dollar',
    solanaMint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    addresses: {
      ethereum: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      arbitrum: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
      optimism: '0x94b008aD8eA7C44F96703eA1D1b9B5e4b6D4bE6f',
      polygon: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      solana: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    },
  },
  PUSD: {
    symbol: 'PUSD',
    name: 'Palm USD',
    decimals: 6,
    category: 'non-freezable dollar',
    solanaMint: 'CZzgUBvxaMLwMhVSLgqJn3npmxoTo6nzMNQPAnwtHF3s',
    addresses: {
      ethereum: '0xfaf0cee6b20e2aaa4b80748a6af4cd89609a3d78',
      bnb: '0xfaf0cee6b20e2aaa4b80748a6af4cd89609a3d78',
      adi: '0x21B9AD9B15A9888cD57ACEEAc6Bd79093fA9D8E0',
      solana: 'CZzgUBvxaMLwMhVSLgqJn3npmxoTo6nzMNQPAnwtHF3s',
    },
  },
};

export const STABLECOIN_OPTIONS = Object.values(STABLECOINS);

export function getStablecoin(symbol) {
  return STABLECOINS[String(symbol || '').toUpperCase()] || null;
}

export function getTokenAddress(symbol, chain) {
  return getStablecoin(symbol)?.addresses?.[chain] || null;
}

export function getSolanaMint(symbol) {
  return getStablecoin(symbol)?.solanaMint || null;
}

export function toBaseUnits(amount, decimals = 6) {
  const [whole = '0', fraction = ''] = String(amount || '0').split('.');
  const paddedFraction = `${fraction}${'0'.repeat(decimals)}`.slice(0, decimals);
  return `${BigInt(whole || '0') * 10n ** BigInt(decimals) + BigInt(paddedFraction || '0')}`;
}

export function fromBaseUnits(amount, decimals = 6) {
  const raw = BigInt(amount || 0);
  const unit = 10n ** BigInt(decimals);
  const whole = raw / unit;
  const fraction = String(raw % unit).padStart(decimals, '0').replace(/0+$/, '');
  return Number(`${whole}${fraction ? `.${fraction}` : ''}`);
}

export const PRIVACY_MODES = {
  STANDARD: 'standard',
  CLOAK: 'cloak',
  UMBRA: 'umbra',
};

export const PRIVACY_MODE_OPTIONS = [
  {
    id: PRIVACY_MODES.STANDARD,
    title: 'Standard route',
    description: 'Fastest path into yield with full route review before you confirm.',
    detail: 'Best for everyday deposits.',
  },
  {
    id: PRIVACY_MODES.CLOAK,
    title: 'Private treasury route',
    description: 'Keep treasury movement private before funds enter the yield route.',
    detail: 'Best for larger balances and business wallets.',
  },
  {
    id: PRIVACY_MODES.UMBRA,
    title: 'Private balance route',
    description: 'Hold funds in an encrypted balance, then withdraw into the deposit route when ready.',
    detail: 'Best when balance privacy matters before execution.',
  },
];

export function getPrivacyBoundary(mode) {
  if (mode === PRIVACY_MODES.CLOAK) {
    return {
      title: 'Private before route',
      description: 'Treasury movement stays private before funds enter the public yield route.',
    };
  }
  if (mode === PRIVACY_MODES.UMBRA) {
    return {
      title: 'Encrypted balance first',
      description: 'Funds can sit encrypted before you withdraw into the deposit route.',
    };
  }
  return {
    title: 'Standard visibility',
    description: 'The route is public on-chain after you confirm.',
  };
}
