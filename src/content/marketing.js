// Marketing copy & content structure.
// Kept intentionally rich so downstream components stay declarative.

export const SUPPORTED_CHAINS = [
  { id: 'ethereum', label: 'Ethereum', short: 'ETH', color: '#7E4D22', angle: 18 },
  { id: 'arbitrum', label: 'Arbitrum', short: 'ARB', color: '#A86F24', angle: 82 },
  { id: 'base', label: 'Base', short: 'BASE', color: '#C58B35', angle: 148 },
  { id: 'polygon', label: 'Polygon', short: 'POL', color: '#D6A84F', angle: 218 },
  { id: 'optimism', label: 'Optimism', short: 'OP', color: '#E8C46C', angle: 286 },
  { id: 'solana', label: 'Solana', short: 'SOL', color: '#F8E6B6', angle: 350 },
];

export const MARKETING_CONTENT = {
  dataSourceNotes: {
    marketingMetrics:
      'Marketing numbers are kept in this content module so production can replace them with API-fed metrics without editing presentation components.',
    appPreview:
      'Phone mockup values mirror the deposit flow state shape and can be replaced by live quote, vault, wallet and portfolio data.',
  },
  hero: {
    eyebrow: 'Stablecoin yield on Solana',
    headline: 'Move stablecoins into Solana yield with clarity.',
    subheadline:
      'Route USDC and USDT from Ethereum, Arbitrum, Base, Polygon or Optimism into audited Solana vaults — destination, fees and APY visible before you sign.',
    primaryCta: 'Start earning',
    secondaryCta: 'How the route works',
    live: [
      { label: 'Live vault APY', value: '8.42%', trend: '+0.14%' },
      { label: 'Bridges settling now', value: '12' },
      { label: 'Routed this week', value: '$4.12M' },
    ],
    trustChips: [
      'Self-custodial',
      'MEV-protected via Jito',
      'Audited destinations only',
    ],
  },
  liveMetrics: [
    { key: 'tvl', label: 'Total routed', prefix: '$', value: 4120000, format: 'compact', suffix: '+' },
    { key: 'apy', label: 'Best live APY', value: 8.42, format: 'decimal', suffix: '%' },
    { key: 'chains', label: 'Source chains', value: 5, format: 'integer', suffix: '' },
    { key: 'vaults', label: 'Audited vaults', value: 14, format: 'integer', suffix: '' },
    { key: 'savings', label: 'MEV loss saved', prefix: '$', value: 182400, format: 'compact', suffix: '+' },
  ],
  marqueeChains: ['Ethereum', 'Arbitrum', 'Base', 'Polygon', 'Optimism', 'Solana'],
  marqueePartners: ['Kamino', 'Solflare', 'LI.FI', 'Jito', 'DFlow', 'QuickNode'],
  story: {
    eyebrow: 'A clearer path to yield',
    title: 'Keep control from the first quote to the final receipt.',
    paragraphs: [
      'Stablecoins sit idle when moving them into yield takes too many tools, too many approvals and too little price certainty.',
      'Yieldiz turns that journey into one quoted route — bridge cost, swap cost, MEV protection and final APY are visible before you sign.',
    ],
    assetSlot: 'story-portrait',
    asset: '/marketing/portrait-finance-operator.svg',
    assetAlt: 'Yieldiz route preview shown in a calm finance workspace',
  },
  routeDiagram: {
    eyebrow: 'How a deposit travels',
    title: 'One signature moves capital across five chains.',
    subtitle:
      'The route is the same every time — your balance is read on the source chain, bridged to Solana, swapped at quoted price, executed atomically and deposited into a vault you chose. Five precise handoffs, one signature.',
    steps: [
      {
        step: '01',
        title: 'Source chain',
        detail: 'We read your stablecoin balance across Ethereum, Arbitrum, Base, Polygon and Optimism through your connected wallet.',
        partner: 'Solflare',
      },
      {
        step: '02',
        title: 'Cross-chain bridge',
        detail: 'LI.FI selects the optimal route and fee tier. You approve once; we handle reconciliation as funds land on Solana.',
        partner: 'LI.FI',
      },
      {
        step: '03',
        title: 'Final-leg swap',
        detail: 'If the vault accepts a different token, DFlow routes the final swap through deep Solana liquidity at quoted price.',
        partner: 'DFlow',
      },
      {
        step: '04',
        title: 'MEV shield',
        detail: 'The destination deposit is packaged into a Jito bundle — atomic, front-run-proof, and confirmed in a single slot.',
        partner: 'Jito',
      },
      {
        step: '05',
        title: 'Yield destination',
        detail: 'Capital lands in a Kamino vault with live APY, TVL and risk profile — all visible in your dashboard from minute one.',
        partner: 'Kamino',
      },
    ],
  },
  phoneFlow: {
    eyebrow: 'Inside Yieldiz',
    title: 'Five taps from your wallet to live yield.',
    subtitle:
      'Connect, choose, review, confirm, earn — with route cost, privacy choice and destination visible before money moves.',
    screens: [
      {
        key: 'connect',
        label: 'Step 1 — Connect',
        caption: 'Link Solflare, Phantom or Backpack. Your wallet remains in control.',
      },
      {
        key: 'choose',
        label: 'Step 2 — Choose',
        caption: 'Pick your source chain, token and amount. Live balances across all five chains.',
      },
      {
        key: 'route',
        label: 'Step 3 — Review',
        caption: 'Check the path, route cost, privacy boundary and destination before confirming.',
      },
      {
        key: 'confirm',
        label: 'Step 4 — Confirm',
        caption: 'Confirm the quoted route and track settlement across every handoff.',
      },
      {
        key: 'earning',
        label: 'Step 5 — Earning',
        caption: 'Position lives in your dashboard with live APY, yield accrual and on-chain receipts.',
      },
    ],
    assetSlot: 'phone-hand',
    appPreview: {
      wallets: [
        { name: 'Solflare', tag: 'Recommended', color: '#FFB02E' },
        { name: 'Phantom', tag: 'Popular', color: '#AB9FF2' },
        { name: 'Backpack', tag: 'Secure option', color: '#E33E3E' },
      ],
      sourceBalances: {
        ethereum: '2,450.32',
        arbitrum: '840.10',
        base: '212.44',
        polygon: '1,092.87',
        optimism: '0.00',
      },
      amount: {
        display: '$1,000',
        decimals: '.00 USDC',
        quickActions: ['25%', '50%', 'MAX'],
      },
      routePreview: [
        { step: 'Bridge', via: 'LI.FI · Stargate', time: '~35s', value: '$0.80' },
        { step: 'Swap', via: 'DFlow · Solana', time: '~2s', value: '$0.04' },
        { step: 'Shield', via: 'Jito bundle', time: '~0.4s', value: 'MEV $0' },
        { step: 'Deposit', via: 'Kamino USDC Multiply', time: '~1s', value: '8.42%' },
      ],
      quote: {
        receive: '999.12 USDC',
        annualized: '≈ $82/yr at current 8.42% APY',
      },
      progress: [
        { step: 'Bridge · Ethereum → Solana', status: 'done' },
        { step: 'Final swap · DFlow', status: 'done' },
        { step: 'Jito bundle submitted', status: 'live' },
        { step: 'Deposit · Kamino vault', status: 'queued' },
      ],
      settlementEstimate: '0:42 remaining',
      portfolio: {
        total: '$5,230.00',
        earned: '+$42.18',
        bestApy: '8.42',
        activeVault: 'Kamino USDC Multiply · Low risk',
        positions: [
          { name: 'USDC Multiply', value: '$3,000', apy: '8.4%' },
          { name: 'SOL-USDC LP', value: '$2,230', apy: '12.1%' },
        ],
      },
    },
  },
  routeControls: {
    eyebrow: 'Before you sign',
    title: 'More control, without more steps.',
    subtitle:
      'Yieldiz adds the checks that matter before money moves: stablecoin choice, optional privacy before the public vault route, and a local review of what you are about to sign.',
    cards: [
      {
        title: 'More stablecoin choice',
        description:
          'Route USDC, USDT or Palm USD into the same clear deposit flow, with the route blocked if liquidity is not available.',
      },
      {
        title: 'Privacy when it matters',
        description:
          'Choose a standard route, private treasury movement or private balance flow before funds enter the public vault deposit.',
      },
      {
        title: 'Review on your device',
        description:
          'Get a plain-language route check locally before confirming — useful for fees, destination, privacy boundary and route risk.',
      },
    ],
  },
  partners: {
    eyebrow: 'Infrastructure',
    title: 'The route stack behind every deposit.',
    subtitle:
      'Every deposit depends on a clear sequence: wallet signing, bridge routing, optional swap, protected Solana execution, vault entry and route checks before confirmation.',
    list: [
      {
        partner: 'Solflare',
        role: 'Wallet & self-custody',
        description:
          'The primary Solana wallet path. Your keys stay in your wallet; Yieldiz requests signatures through the standard adapter.',
        metric: { value: 'Wallet', label: 'user signs' },
        logoMark: 'SF',
        accent: '#FFB02E',
      },
      {
        partner: 'LI.FI',
        role: 'Cross-chain bridge aggregator',
        description:
          'Quotes and executes the source-chain bridge leg when funds start outside Solana.',
        metric: { value: 'Bridge', label: 'source to Solana' },
        logoMark: 'LI',
        accent: '#F36B8F',
      },
      {
        partner: 'DFlow',
        role: 'Solana swap engine',
        description:
          'Handles final-leg token conversion when the selected vault accepts a different asset.',
        metric: { value: 'Swap', label: 'only if needed' },
        logoMark: 'DF',
        accent: '#A86F24',
      },
      {
        partner: 'Kamino',
        role: 'Yield vault engine',
        description:
          'The vault destination. Users choose the vault before signing and can review APY, token and risk context.',
        metric: { value: 'Vault', label: 'chosen by user' },
        logoMark: 'KM',
        accent: '#D6A84F',
      },
      {
        partner: 'Jito',
        role: 'MEV protection',
        description:
          'Submits the final Solana leg as a protected bundle when bundle submission is configured.',
        metric: { value: 'Bundle', label: 'protected entry' },
        logoMark: 'JT',
        accent: '#F1D27A',
      },
      {
        partner: 'QuickNode',
        role: 'Solana RPC & data',
        description:
          'Provides Solana RPC and subscription access for balances, transaction status and vault interactions.',
        metric: { value: 'RPC', label: 'chain state' },
        logoMark: 'QN',
        accent: '#FF5D1F',
      },
      {
        partner: 'GoldRush',
        role: 'Route confidence',
        description:
          'Checks balances, recent activity and token approvals before the user confirms a route. It belongs here because it directly improves pre-signing confidence.',
        metric: { value: '3 checks', label: 'before signing' },
        logoMark: 'GR',
        accent: '#7E4D22',
      },
    ],
  },
  mevShield: {
    eyebrow: 'MEV protection, not MEV exposure',
    title: 'Two routes. One keeps the quote intact.',
    subtitle:
      'Yieldiz separates the risky public path from the protected deposit path, so users understand exactly why the final swap and vault entry are bundled before execution.',
    before: {
      label: 'Unprotected route',
      bullets: [
        'Swap is visible before it lands',
        'Bots can reorder around the transaction',
        'Execution can drift from the quote',
        'Leakage is hard to spot after settlement',
      ],
      lossLabel: 'Avg. leakage per $10k deposit',
      lossValue: '~$18–$60',
    },
    after: {
      label: 'Protected Yieldiz route',
      bullets: [
        'Swap and vault deposit move as one bundle',
        'No partial route can land by itself',
        'Submitted away from public mempool exposure',
        'The route either completes or safely reverts',
      ],
      lossLabel: 'MEV loss on a Yieldiz deposit',
      lossValue: '$0',
    },
    footnote: 'All final-leg swaps and vault deposits route through Jito’s block engine.',
  },
  vaultSpotlight: {
    eyebrow: 'Today’s top vaults',
    title: 'Live yield, transparent risk.',
    subtitle: 'A small, curated set — not an endless wall of pools. Every vault shown here has been audited, has live TVL, and accepts deposits from any of the five source chains.',
    vaults: [
      {
        name: 'USDC Multiply',
        pair: 'USDC',
        apy: 8.42,
        tvl: '$4.1M',
        risk: 'Low',
        riskScore: 2,
        badge: 'Most deposited',
        strategy: 'Leveraged lending against Solana stablecoin markets',
      },
      {
        name: 'USDC–USDT LP',
        pair: 'USDC / USDT',
        apy: 6.18,
        tvl: '$2.8M',
        risk: 'Low',
        riskScore: 1,
        badge: 'Lowest variance',
        strategy: 'Stablecoin-pair LP with auto-rebalancing',
      },
      {
        name: 'JitoSOL Boost',
        pair: 'USDC → JitoSOL',
        apy: 11.94,
        tvl: '$1.6M',
        risk: 'Medium',
        riskScore: 3,
        badge: 'Highest yield',
        strategy: 'Stablecoin → LST yield with delta hedging',
      },
    ],
  },
  security: {
    eyebrow: 'Security & control',
    title: 'Designed around one principle: the funds are yours.',
    points: [
      {
        title: 'Non-custodial by design',
        description:
          'Yieldiz never holds, pools or rehypothecates user funds. Every transaction is signed by your wallet and broadcast directly to each chain.',
      },
      {
        title: 'Transparent pricing, always',
        description:
          'Bridge fee, swap fee, network fee, MEV savings and final APY are shown before the first signature. Nothing is marked up inside the quote.',
      },
      {
        title: 'Audited destinations only',
        description:
          'We whitelist vault destinations: Kamino, MarginFi, Drift. No experimental pools, no newly-launched forks, no vault-of-the-week.',
      },
    ],
    assetSlot: 'security-device',
  },
  // Note: testimonials data is intentionally omitted from the live build.
  // Re-add only when real, attributed user quotes are available.
  personas: {
    eyebrow: 'Who Yieldiz is for',
    title: 'The same clear route, for personal balances and treasury capital.',
    list: [
      {
        title: 'Individuals',
        subtitle: 'Put your stablecoins to work',
        description:
          'Earn market-driven yield on USDC and USDT without juggling bridges or learning a new wallet. Withdraw to any source chain, any time.',
        assetSlot: 'persona-individual',
        asset: '/marketing/portrait-finance-operator.svg',
        assetAlt: 'Individual Yieldiz user reviewing a deposit route',
        bullets: ['Live APY before you sign', 'Withdraw to any source chain', 'No minimums, no lockups'],
      },
      {
        title: 'Teams & treasuries',
        subtitle: 'Allocate with clarity',
        description:
          'Move treasury balances into Solana yield with the audit trail finance teams require. Multisig and hardware wallet ready via Solflare.',
        assetSlot: 'persona-treasury',
        asset: '/marketing/team-finance-scene.svg',
        assetAlt: 'Yieldiz execution network for treasury route review',
        bullets: ['Route + fees exportable as CSV', 'Hardware wallet + multisig ready', 'Destination whitelist only'],
      },
    ],
  },
  faq: [
    {
      q: 'Does Yieldiz hold my funds at any point?',
      a: 'No. Every transaction is signed by your wallet, and funds move directly through the selected bridge, swap route and vault program. Yieldiz does not pool, custody or rehypothecate user balances.',
    },
    {
      q: 'What happens if the bridge takes longer than expected?',
      a: 'Bridge settlement times are quoted up front by LI.FI. If a route stalls, the bridge provider is responsible for reconciliation, and Yieldiz tracks status through QuickNode until the destination transaction confirms.',
    },
    {
      q: 'Can I withdraw my yield back to my source chain?',
      a: 'Yes. Any position can be unwound and routed back through the same network path to Ethereum, Arbitrum, Base, Polygon or Optimism — or to a different chain of your choice.',
    },
    {
      q: 'Which chains and vaults are supported?',
      a: 'Source: Ethereum, Arbitrum, Base, Polygon, Optimism. Destinations: audited Kamino vaults (and shortly MarginFi, Drift). Destinations expand only after a new vault passes our review.',
    },
  ],
  finalCta: {
    eyebrow: 'Ready when you are',
    title: 'Route your first stablecoin deposit in under three minutes.',
    description:
      'Connect a wallet, pick a chain, pick a vault, confirm. Your capital starts earning — and stays yours to withdraw whenever you want.',
    primaryCta: 'Start earning',
    secondaryCta: 'Talk to the team',
    assetSlot: 'final-cta',
    asset: '/marketing/final-cta-scene.svg',
    assetAlt: 'Yieldiz deposit terminal in a premium finance scene',
  },
  footer: {
    product: [
      { label: 'How it works', href: '#operating-model' },
      { label: 'Live vaults', href: '#vault-spotlight' },
      { label: 'Security', href: '#security-layer' },
      { label: 'FAQ', href: '#faq' },
    ],
    infrastructure: [
      { label: 'Solflare', href: 'https://solflare.com' },
      { label: 'Kamino', href: 'https://kamino.finance' },
      { label: 'LI.FI', href: 'https://li.fi' },
      { label: 'Jito', href: 'https://jito.network' },
      { label: 'DFlow', href: 'https://dflow.net' },
      { label: 'QuickNode', href: 'https://quicknode.com' },
      { label: 'GoldRush', href: 'https://goldrush.dev' },
    ],
    company: [
      { label: 'About', href: '#product-story' },
      { label: 'Contact', href: 'mailto:hello@yieldiz.app' },
      { label: 'Terms', href: '#' },
      { label: 'Privacy', href: '#' },
    ],
  },
};
