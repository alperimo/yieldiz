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
      'SolGate turns that journey into one quoted route — bridge cost, swap cost, MEV protection and final APY are visible before you sign.',
    ],
    assetSlot: 'story-portrait',
    asset: '/marketing/portrait-finance-operator.svg',
    assetAlt: 'SolGate route preview shown in a calm finance workspace',
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
    eyebrow: 'Inside the app',
    title: 'Five taps from your wallet to live yield.',
    subtitle:
      'Connect, choose, review, confirm, earn — the same five steps every time, with the destination and the cost visible from the first tap.',
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
        label: 'Step 3 — Route',
        caption: 'See the full path — bridge, swap, MEV shield, destination — before confirming.',
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
  partners: {
    eyebrow: 'Infrastructure',
    title: 'Built on the most trusted services on Solana.',
    subtitle:
      'Every layer of the deposit — wallet signing, cross-chain transfer, on-chain liquidity, vault execution, MEV protection and live data — runs on the leading service for that job. SolGate is the layer that makes them work as one route.',
    list: [
      {
        partner: 'Solflare',
        role: 'Wallet & self-custody',
        description:
          'Industry-leading non-custodial wallet for Solana, with hardware wallet support, in-wallet staking and a mobile-first account layer. Your keys never leave your device — SolGate signs through the adapter.',
        metric: { value: '2.5M+', label: 'wallets secured' },
        logoMark: 'SF',
        accent: '#FFB02E',
      },
      {
        partner: 'LI.FI',
        role: 'Cross-chain bridge aggregator',
        description:
          'Aggregates 20+ bridges and 40+ DEXs across 25 chains to find the cheapest, fastest route for each stablecoin transfer. Routes are computed in real time against live liquidity.',
        metric: { value: '$9B+', label: 'bridged volume' },
        logoMark: 'LI',
        accent: '#F36B8F',
      },
      {
        partner: 'DFlow',
        role: 'Solana swap engine',
        description:
          'Institutional order-flow-aware swap router on Solana. Surfaces deeper liquidity than public DEX aggregators at the final-leg swap, with price improvement quoted up front.',
        metric: { value: '0 bps', label: 'typical slippage' },
        logoMark: 'DF',
        accent: '#A86F24',
      },
      {
        partner: 'Kamino',
        role: 'Yield vault engine',
        description:
          'Solana’s most-used yield vault platform — multi-asset strategies, live risk scoring, and TVL visible on-chain. Every SolGate deposit lands in a Kamino vault you selected explicitly.',
        metric: { value: '$2.1B+', label: 'vault TVL' },
        logoMark: 'KM',
        accent: '#D6A84F',
      },
      {
        partner: 'Jito',
        role: 'MEV protection',
        description:
          'Solana’s dominant MEV infrastructure. SolGate bundles the final swap + deposit and submits via Jito, making the entry atomic and immune to sandwich attacks.',
        metric: { value: '100%', label: 'of deposits bundled' },
        logoMark: 'JT',
        accent: '#F1D27A',
      },
      {
        partner: 'QuickNode',
        role: 'Solana RPC & data',
        description:
          'Enterprise-grade Solana RPC with 99.99% uptime and priority-fee optimization. Live balances, vault metrics and transaction status stream through QuickNode infrastructure.',
        metric: { value: '99.99%', label: 'uptime SLA' },
        logoMark: 'QN',
        accent: '#FF5D1F',
      },
    ],
  },
  mevShield: {
    eyebrow: 'MEV protection, not MEV exposure',
    title: 'The reason most DeFi entries underperform their quote: MEV.',
    subtitle:
      'On unprotected routes, bots watch the mempool for large swaps and sandwich them — selling to you at a worse price, then buying back. The result is a quiet, compounding loss that lives outside most UIs.',
    before: {
      label: 'Typical deposit route',
      bullets: [
        'Swap transaction sits in the public mempool',
        'Bots front-run with a buy at a higher tick',
        'Your swap executes at the worse price',
        'Bot closes — extracting the spread from you',
      ],
      lossLabel: 'Avg. leakage per $10k deposit',
      lossValue: '~$18–$60',
    },
    after: {
      label: 'SolGate deposit route',
      bullets: [
        'Swap + deposit packaged into a Jito bundle',
        'Bundle is atomic — partial fills impossible',
        'Submitted directly to a validator; no public mempool exposure',
        'Either the full bundle lands, or nothing does',
      ],
      lossLabel: 'MEV loss on a SolGate deposit',
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
          'SolGate never holds, pools or rehypothecates user funds. Every transaction is signed by your wallet and broadcast directly to each chain.',
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
    eyebrow: 'Who SolGate is for',
    title: 'The same clear route, for personal balances and treasury capital.',
    list: [
      {
        title: 'Individuals',
        subtitle: 'Put your stablecoins to work',
        description:
          'Earn market-driven yield on USDC and USDT without juggling bridges or learning a new wallet. Withdraw to any source chain, any time.',
        assetSlot: 'persona-individual',
        asset: '/marketing/portrait-finance-operator.svg',
        assetAlt: 'Individual SolGate user reviewing a deposit route',
        bullets: ['Live APY before you sign', 'Withdraw to any source chain', 'No minimums, no lockups'],
      },
      {
        title: 'Teams & treasuries',
        subtitle: 'Allocate with clarity',
        description:
          'Move treasury balances into Solana yield with the audit trail finance teams require. Multisig and hardware wallet ready via Solflare.',
        assetSlot: 'persona-treasury',
        asset: '/marketing/execution-network.svg',
        assetAlt: 'SolGate execution network for treasury route review',
        bullets: ['Route + fees exportable as CSV', 'Hardware wallet + multisig ready', 'Destination whitelist only'],
      },
    ],
  },
  faq: [
    {
      q: 'Does SolGate hold my funds at any point?',
      a: 'No. Every transaction is signed by your wallet, and funds move directly through the selected bridge, swap route and vault program. SolGate does not pool, custody or rehypothecate user balances.',
    },
    {
      q: 'What happens if the bridge takes longer than expected?',
      a: 'Bridge settlement times are quoted up front by LI.FI. If a route stalls, the bridge provider is responsible for reconciliation, and SolGate tracks status through QuickNode until the destination transaction confirms.',
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
    assetAlt: 'SolGate deposit terminal in a premium finance scene',
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
    ],
    company: [
      { label: 'About', href: '#product-story' },
      { label: 'Contact', href: 'mailto:hello@solgate.app' },
      { label: 'Terms', href: '#' },
      { label: 'Privacy', href: '#' },
    ],
  },
};
