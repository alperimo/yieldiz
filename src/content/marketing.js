export const MARKETING_CONTENT = {
  hero: {
    eyebrow: 'Stablecoin yield on Solana',
    headline: 'Your stablecoins, earning where rates are highest.',
    subheadline:
      'Move USDC and USDT from Ethereum, Arbitrum, Base, Polygon or Optimism into the top Solana yield strategies — in a single, transparent flow.',
    primaryCta: 'Start earning',
    secondaryCta: 'See how it works',
    trustLine: 'Know the route before your money moves.',
    trustPoints: [
      'See fees, timing, and final APY before you confirm',
      'Keep custody of your wallet at every step',
      'Land directly in audited Solana yield vaults',
    ],
  },
  proofPoints: [
    {
      label: 'Source chains',
      value: '5 networks',
      detail: 'Move stablecoins from Ethereum, Arbitrum, Base, Polygon or Optimism into Solana in one guided route.',
    },
    {
      label: 'Yield destination',
      value: 'Top Solana vaults',
      detail: 'Capital lands in audited Kamino strategies with live APY visibility before you commit.',
    },
    {
      label: 'Average APY',
      value: '8.4% on USDC',
      detail: 'Displayed from live vault data and refreshed continuously as market conditions change.',
    },
  ],
  story: {
    eyebrow: 'Why SolGate',
    title: 'The simplest way to earn yield on Solana.',
    paragraphs: [
      'Today, earning real yield on stablecoins means juggling bridges, swaps, wallets and dashboards. Most of the return disappears into friction and confusion.',
      'SolGate replaces that with one clear path. Pick the chain you hold capital on, choose a vault, and confirm. The route, fees and final APY are visible up front — no hidden steps.',
      'The result is calm enough for first-time users and clear enough for serious balances.',
    ],
    featuredAsset: '/marketing/portrait-finance-operator.svg',
  },
  howItWorks: [
    {
      step: '01',
      title: 'Connect your wallet',
      detail:
        'Link Solflare, Phantom or Backpack in a single click. We never touch your keys, and you can disconnect at any time.',
      callout: 'You stay in control',
    },
    {
      step: '02',
      title: 'Pick a chain and amount',
      detail:
        'Choose where your stablecoins are today — Ethereum, Arbitrum, Base, Polygon or Optimism — and how much you want to put to work.',
      callout: 'Start from the chain you already use',
    },
    {
      step: '03',
      title: 'Choose a yield vault',
      detail:
        'Browse curated Kamino strategies with live APY, total value locked, and risk profile before you decide where to land.',
      callout: 'Compare live options',
    },
    {
      step: '04',
      title: 'Confirm one transaction',
      detail:
        'We bridge, swap and deposit in a single confirmation. The final step on Solana is sent through Jito for MEV protection.',
      callout: 'Approve once',
    },
    {
      step: '05',
      title: 'Track and withdraw anytime',
      detail:
        'Watch your position grow in your dashboard. Earnings compound automatically, and you can withdraw to any chain on demand.',
      callout: 'Leave when you want',
    },
  ],
  partnerStack: [
    {
      partner: 'Solflare',
      role: 'Wallet & access',
      value: 'Connect with Solflare, Phantom, or Backpack without giving up self-custody.',
      riskReduction: 'Your wallet stays yours.',
    },
    {
      partner: 'LI.FI',
      role: 'Cross-chain bridge',
      value: 'Routes stablecoins from major EVM chains into Solana without manual bridge hopping.',
      riskReduction: 'See routing and fees before you confirm.',
    },
    {
      partner: 'DFlow',
      role: 'Smart swaps',
      value: 'Finds deep liquidity for the final swap as funds arrive on Solana.',
      riskReduction: 'Better execution at the final step.',
    },
    {
      partner: 'Kamino',
      role: 'Yield vaults',
      value: 'Capital lands in audited Solana vault strategies with live APY visibility.',
      riskReduction: 'Yield starts where the route ends.',
    },
    {
      partner: 'Jito',
      role: 'MEV protection',
      value: 'Protects the final Solana transaction from front-running and harmful slippage.',
      riskReduction: 'The quoted route stays closer to the delivered result.',
    },
    {
      partner: 'QuickNode',
      role: 'Solana infrastructure',
      value: 'Keeps balances, fees, and transaction updates live inside the app.',
      riskReduction: 'Fresh data while your deposit is in motion.',
    },
  ],
  security: {
    eyebrow: 'Security & control',
    title: 'Designed to protect your capital at every step.',
    points: [
      {
        title: 'You hold the keys',
        description:
          'SolGate never touches or stores your funds. Every transaction is signed by your wallet and broadcast directly on-chain.',
      },
      {
        title: 'MEV-protected execution',
        description:
          'Final deposits are routed through Jito bundles, the same protection professional traders use to avoid front-running.',
      },
      {
        title: 'Full transparency, every time',
        description:
          'Routes, fees, slippage, and final APY are shown before you confirm. No hidden steps, no surprise costs.',
      },
      {
        title: 'Audited integrations only',
        description:
          'We only route through audited, battle-tested protocols — Kamino, LI.FI, Jito and QuickNode — trusted by the largest DeFi teams.',
      },
    ],
    featuredAsset: '/marketing/security-device.svg',
  },
  personas: [
    {
      title: 'For individuals',
      subtitle: 'Put your stablecoins to work',
      description:
        'Earn competitive, market-driven yield on USDC and USDT — without juggling bridges or learning a new wallet for every chain.',
      asset: '/marketing/portrait-finance-operator.svg',
    },
    {
      title: 'For teams & treasuries',
      subtitle: 'Allocate capital with clarity',
      description:
        'Move treasury balances into Solana yield with the audit trail and route transparency your finance team expects.',
      asset: '/marketing/team-finance-scene.svg',
    },
  ],
  finalCta: {
    eyebrow: 'Ready when you are',
    title: 'Start earning on your stablecoins in minutes.',
    description:
      'Connect your wallet, pick a vault, and confirm one transaction. Your capital is at work on Solana — protected, transparent, and always yours to withdraw.',
    primaryCta: 'Start earning',
    secondaryCta: 'Read how it works',
    featuredAsset: '/marketing/final-cta-scene.svg',
  },
};
