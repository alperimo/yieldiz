export const APP_VERSION = '0.1.0';

export const STRINGS = {
  APP_NAME: 'SolGate',
  APP_TAGLINE: 'Cross-Chain Yield Routing for Solana',
  APP_LOGO_ABBR: 'SG',

  // App hero
  HERO_HEADLINE: 'Earn yield on your stablecoins.',
  HERO_SUBHEADLINE: 'Bridge from any major chain into top Solana vaults — in one transparent flow.',
  HERO_CTA: 'Start deposit',

  // Navigation
  NAV_DEPOSIT: 'Deposit',
  NAV_DASHBOARD: 'Dashboard',
  NAV_VAULTS: 'Vaults',
  NAV_SETTINGS: 'Settings',

  // Wallet
  CONNECT_WALLET: 'Connect Wallet',
  CONNECT_SOLFLARE: 'Connect with Solflare',
  DISCONNECT: 'Disconnect',
  WALLET_CONNECTED: 'Connected',
  WALLET_CONNECT_PROMPT: 'Connect your wallet to view your portfolio and positions.',

  // Network
  NETWORK_MAINNET: 'Mainnet',
  NETWORK_DEVNET: 'Devnet',

  // Deposit Flow
  DEPOSIT_FROM: 'From',
  DEPOSIT_TO: 'To Kamino Vault',
  DEPOSIT_AMOUNT_PLACEHOLDER: '0.00',
  DEPOSIT_MAX: 'MAX',
  DEPOSIT_BALANCE: 'Balance',
  DEPOSIT_ROUTE_DETAILS: 'Route Details',
  DEPOSIT_ESTIMATED_YIELD: 'Estimated annual yield',
  DEPOSIT_MEV_PROTECTED: 'MEV Protected via Jito',
  DEPOSIT_NETWORK_FEE: 'Network Fee',
  DEPOSIT_BRIDGE_FEE: 'Bridge Fee',
  DEPOSIT_SLIPPAGE: 'Slippage Tolerance',
  DEPOSIT_TOTAL_TIME: 'Total Time',
  DEPOSIT_SELECT_VAULT: 'Select a vault',

  // Dashboard
  DASHBOARD_TITLE: 'Your Portfolio',
  DASHBOARD_TOTAL_DEPOSITED: 'Total Deposited',
  DASHBOARD_TOTAL_EARNED: 'Total Earned',
  DASHBOARD_DAYS_ACTIVE: 'days active',
  DASHBOARD_ACTIVE: 'Active',
  DASHBOARD_ACTIVE_POSITIONS: 'Active Positions',
  DASHBOARD_RECENT_TX: 'Recent Transactions',

  // Vaults
  VAULTS_TITLE: 'Explore Vaults',
  VAULTS_SEARCH_PLACEHOLDER: 'Search vaults...',
  VAULTS_SORT_APY: 'APY',
  VAULTS_SORT_TVL: 'TVL',
  VAULTS_DEPOSIT: 'Deposit',
  VAULTS_POWERED_BY: 'Vault destination via Kamino',
  VAULTS_DATA_BY: 'Solana state via QuickNode',
  VAULTS_VIEW_ALL: 'View all',
  VAULTS_TOP_TITLE: 'Top Vaults',
  VAULTS_RISK_ALL: 'All Risk',

  // Transaction Status
  TX_IN_PROGRESS: 'Transaction in Progress',
  TX_STEP_BRIDGE: 'Bridge',
  TX_STEP_SWAP: 'Swap',
  TX_STEP_DEPOSIT: 'Deposit',
  TX_STEP_DONE: 'Done',
  TX_SUMMARY: 'Summary',
  TX_DEPOSITED: 'Deposited',
  TX_FEES: 'Fees',
  TX_ESTIMATED_ANNUAL: 'Est. Annual',
  TX_VIEW_EXPLORER: 'View on Solscan',
  TX_BACK_DASHBOARD: 'Back to Dashboard',
  TX_HASH_LABEL: 'Tx:',

  // States
  STATE_LOADING: 'Loading...',
  STATE_ERROR: 'Something went wrong',
  STATE_ERROR_DESCRIPTION: 'An unexpected error occurred. Please try refreshing.',
  STATE_RETRY: 'Try Again',
  STATE_EMPTY_POSITIONS: 'No active positions yet. Deposit into a vault to get started.',
  STATE_EMPTY_TRANSACTIONS: 'No transactions yet.',
  STATE_EMPTY_VAULTS: 'No vaults found matching your filters.',
  STATE_NO_DATA: 'No data available',

  // Risk Levels
  RISK_LOW: 'Low',
  RISK_MEDIUM: 'Medium',
  RISK_HIGH: 'High',

  // Partners
  PARTNERS_FOOTER: 'Execution stack',

  // Stats Labels
  STATS_TVL: 'TVL',
  STATS_AVG_APY: 'Avg APY',
  STATS_USERS: 'Users',

  // Features section
  FEATURES_HEADLINE: 'Built for serious capital',
  FEATURE_CHAINS_TITLE: 'Five chains, one app',
  FEATURE_CHAINS_DESC: 'Move USDC and USDT from Ethereum, Arbitrum, Base, Polygon and Optimism into Solana yield.',
  FEATURE_MEV_TITLE: 'MEV-protected entry',
  FEATURE_MEV_DESC: 'Final deposits route through Jito so you get the price you saw — never a worse one.',
  FEATURE_RATES_TITLE: 'Transparent every step',
  FEATURE_RATES_DESC: 'Fees, route, and final APY are visible before you confirm. No hidden costs.',
  FEATURE_YIELD_TITLE: 'Audited Kamino vaults',
  FEATURE_YIELD_DESC: 'Capital lands in battle-tested strategies built by one of the largest DeFi teams.',

  // Hero badge
  HERO_BADGE: 'Solana yield routing • 5 source chains live',
};

export const CHAINS = [
  { id: 'ethereum', name: 'Ethereum', chainId: 1, icon: 'Ξ', explorerUrl: 'https://etherscan.io' },
  { id: 'arbitrum', name: 'Arbitrum', chainId: 42161, icon: '△', explorerUrl: 'https://arbiscan.io' },
  { id: 'base', name: 'Base', chainId: 8453, icon: '◆', explorerUrl: 'https://basescan.org' },
  { id: 'polygon', name: 'Polygon', chainId: 137, icon: '⬡', explorerUrl: 'https://polygonscan.com' },
  { id: 'optimism', name: 'Optimism', chainId: 10, icon: '⊙', explorerUrl: 'https://optimistic.etherscan.io' },
  { id: 'solana', name: 'Solana', chainId: 0, icon: '◎', explorerUrl: 'https://solscan.io' },
];

export const TOKENS = {
  USDC: { symbol: 'USDC', name: 'USD Coin', decimals: 6, mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' },
  USDT: { symbol: 'USDT', name: 'Tether USD', decimals: 6, mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB' },
  PUSD: { symbol: 'PUSD', name: 'Palm USD', decimals: 6, mint: 'CZzgUBvxaMLwMhVSLgqJn3npmxoTo6nzMNQPAnwtHF3s' },
  SOL: { symbol: 'SOL', name: 'Solana', decimals: 9, mint: 'So11111111111111111111111111111111111111112' },
  JITOSOL: { symbol: 'JitoSOL', name: 'Jito Staked SOL', decimals: 9, mint: 'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn' },
  MSOL: { symbol: 'mSOL', name: 'Marinade SOL', decimals: 9, mint: 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So' },
};

export const PARTNERS = [
  { name: 'Solflare', url: 'https://solflare.com' },
  { name: 'Kamino', url: 'https://kamino.finance' },
  { name: 'LI.FI', url: 'https://li.fi' },
  { name: 'Jito', url: 'https://jito.network' },
  { name: 'DFlow', url: 'https://dflow.net' },
  { name: 'Quicknode', url: 'https://quicknode.com' },
];

export const DEPOSIT_FLOW_STATES = {
  IDLE: 'idle',
  QUOTING: 'quoting',
  APPROVING: 'approving',
  BRIDGING: 'bridging',
  SWAPPING: 'swapping',
  DEPOSITING: 'depositing',
  CONFIRMED: 'confirmed',
  ERROR: 'error',
};

// Explicit Tailwind-safe class maps (dynamic class construction breaks Tailwind purge)
export const RISK_DOT_CLASSES = {
  low: 'bg-sg-success',
  medium: 'bg-sg-warning',
  high: 'bg-sg-error',
};

export const DEFAULT_SLIPPAGE_BPS = 50;
export const DEFAULT_SLIPPAGE_DISPLAY = '0.5%';

export const TOAST_DURATION_MS = 4000;

export const CONFETTI_COLORS = ['#9FE870', '#0F766E', '#2563EB', '#D97706', '#DC2626', '#16A34A'];

export const MOCK_PLATFORM_STATS = {
  tvl: 3_760_000,
  avgApy: 8.8,
  users: 342,
};

// Token badge color classes (explicit for Tailwind purge safety)
export const TOKEN_BADGE_COLORS = {
  USDC: 'bg-sg-accent-blue/[0.15] text-sg-accent-blue border border-sg-accent-blue/20',
  USDT: 'bg-sg-accent-green/[0.15] text-sg-accent-green border border-sg-accent-green/20',
  PUSD: 'bg-[#D6A84F]/20 text-[#7E4D22] border border-[#D6A84F]/30',
  SOL: 'bg-sg-accent-purple/[0.15] text-sg-accent-purple border border-sg-accent-purple/20',
  JitoSOL: 'bg-sg-success/[0.15] text-sg-success border border-sg-success/20',
  mSOL: 'bg-sg-accent-green/[0.15] text-sg-accent-green border border-sg-accent-green/20',
  ETH: 'bg-sg-accent-blue/[0.15] text-sg-accent-blue border border-sg-accent-blue/20',
};

// Shared navigation items
export const NAV_ITEMS = [
  { to: '/app', label: 'NAV_DEPOSIT', iconName: 'ArrowDownToLine' },
  { to: '/app/dashboard', label: 'NAV_DASHBOARD', iconName: 'LayoutDashboard' },
  { to: '/app/vaults', label: 'NAV_VAULTS', iconName: 'Vault' },
];
