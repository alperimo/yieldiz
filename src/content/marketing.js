// Marketing copy & content structure.
// Kept intentionally rich so downstream components stay declarative.

export const SUPPORTED_CHAINS = [
  { id: 'ethereum', label: 'Ethereum', short: 'ETH', color: '#627EEA', angle: 18 },
  { id: 'arbitrum', label: 'Arbitrum', short: 'ARB', color: '#28A0F0', angle: 82 },
  { id: 'base', label: 'Base', short: 'BASE', color: '#0052FF', angle: 148 },
  { id: 'polygon', label: 'Polygon', short: 'POL', color: '#8247E5', angle: 218 },
  { id: 'optimism', label: 'Optimism', short: 'OP', color: '#FF0420', angle: 286 },
  { id: 'solana', label: 'Solana', short: 'SOL', color: '#14F195', angle: 350 },
];

export const MARKETING_CONTENT = {
  hero: {
    eyebrow: 'The stablecoin terminal for Solana',
    headline: 'Your stablecoins. Earning on Solana. In one move.',
    subheadline:
      'SolGate routes USDC and USDT from Ethereum, Arbitrum, Base, Polygon and Optimism into the highest-yield Solana vaults — with the route, fees and final APY shown before you ever confirm.',
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
    eyebrow: 'Why SolGate exists',
    title: 'The yield was already on Solana. The path to it was broken.',
    paragraphs: [
      'Across five major chains, hundreds of billions in stablecoins sit in wallets earning nothing. On Solana, the same dollars can earn real, market-driven yield inside audited vaults — but the bridge from one to the other takes four separate dApps, three browser tabs and one MEV bot between you and your deposit.',
      'SolGate collapses that into a single, transparent flow. One wallet signature moves capital from any supported chain into a curated Solana vault — with every handoff visible, every fee itemized, and every final transaction protected by Jito.',
      'It is built for people who treat on-chain yield like treasury work: the numbers are visible before the move, the route is the same for a $200 deposit and a $2M one, and the funds remain yours at every step.',
    ],
    pullQuote:
      'We wanted something we would trust our own savings to. Then we built it.',
    pullAttribution: 'SolGate core team',
    assetSlot: 'story-portrait',
  },
  routeDiagram: {
    eyebrow: 'The route, end-to-end',
    title: 'One confirmation. Five precise handoffs. Zero hidden steps.',
    subtitle:
      'Each stop is handled by an institutional-grade partner. You see the full path — source, bridge, swap, MEV shield, destination — before the first signature.',
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
    title: 'Built like a fintech. Settles like DeFi.',
    subtitle:
      'The interface is deliberately quiet. The heavy work — routing, quoting, MEV protection, vault selection — happens in the background so the front of the app stays readable and calm.',
    screens: [
      {
        key: 'connect',
        label: 'Step 1 — Connect',
        caption: 'Link Solflare, Phantom or Backpack. Self-custody, always.',
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
        caption: 'One signature. Progress is tracked in real time across every handoff.',
      },
      {
        key: 'earning',
        label: 'Step 5 — Earning',
        caption: 'Position lives in your dashboard with live APY, yield accrual and on-chain receipts.',
      },
    ],
    assetSlot: 'phone-hand',
  },
  partners: {
    eyebrow: 'Institutional infrastructure',
    title: 'Every handoff runs on partners your treasury team would pick.',
    subtitle:
      'SolGate does not rebuild the wheel. We compose six category-leading primitives into one transparent flow. Each partner is load-bearing — remove one and the product breaks.',
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
        accent: '#7C6BFF',
      },
      {
        partner: 'Kamino',
        role: 'Yield vault engine',
        description:
          'Solana’s most-used yield vault platform — multi-asset strategies, live risk scoring, and TVL visible on-chain. Every SolGate deposit lands in a Kamino vault you selected explicitly.',
        metric: { value: '$2.1B+', label: 'vault TVL' },
        logoMark: 'KM',
        accent: '#00C2FF',
      },
      {
        partner: 'Jito',
        role: 'MEV protection',
        description:
          'Solana’s dominant MEV infrastructure. SolGate bundles the final swap + deposit and submits via Jito, making the entry atomic and immune to sandwich attacks.',
        metric: { value: '100%', label: 'of deposits bundled' },
        logoMark: 'JT',
        accent: '#14F195',
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
    subtitle: 'A small, curated set — not an endless wall of pools. Every vault shown here has been audited, has live TVL, and can be deposited into from any supported chain.',
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
        title: 'Jito-protected execution',
        description:
          'The final-leg swap and vault deposit are atomic. Either both land in the same slot, or neither does — no partial, vulnerable states.',
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
  testimonials: {
    eyebrow: 'Trusted by builders and treasuries',
    title: 'People already moving capital through SolGate.',
    quotes: [
      {
        quote: 'The first time I moved USDC from Arbitrum into a Kamino vault, I checked the route four times. I did not need to — every fee was in the quote.',
        author: 'Lea M.',
        role: 'Independent DeFi operator',
        avatarSlot: 'avatar-lea',
      },
      {
        quote: 'We use SolGate for treasury allocations. One signature, visible fees, auditable route — that is the minimum bar for us.',
        author: 'Tomás R.',
        role: 'CFO, on-chain studio',
        avatarSlot: 'avatar-tomas',
      },
      {
        quote: 'It feels less like a DeFi app and more like the back office my bank should have had.',
        author: 'Annika S.',
        role: 'Early Solana user since 2021',
        avatarSlot: 'avatar-annika',
      },
    ],
  },
  personas: {
    eyebrow: 'Built for people with stablecoins',
    title: 'Whether you are routing $500 or $5M, the path is the same.',
    list: [
      {
        title: 'For individuals',
        subtitle: 'Put your stablecoins to work',
        description:
          'Earn real, market-driven yield on USDC and USDT without juggling bridges or learning a new wallet for every chain. Withdraw to any supported network when you want to exit.',
        assetSlot: 'persona-individual',
        bullets: ['Live APY visible before deposit', 'Withdraw to any supported chain', 'No minimums, no lockups'],
      },
      {
        title: 'For teams & treasuries',
        subtitle: 'Allocate with clarity',
        description:
          'Move treasury balances into Solana yield with the audit trail and route transparency finance teams require. Multi-signer support and permissioned spending controls via Solflare.',
        assetSlot: 'persona-treasury',
        bullets: ['Route + fees exportable as CSV', 'Hardware wallet + multisig ready', 'Destination whitelist only'],
      },
    ],
  },
  faq: [
    {
      q: 'Does SolGate hold my funds at any point?',
      a: 'No. Every transaction is signed by your wallet. SolGate is a routing and interface layer — your capital moves directly between chains, bridges, swap routers and vault programs, and lives in your wallet the entire time.',
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
