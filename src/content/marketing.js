export const MARKETING_CONTENT = {
  hero: {
    eyebrow: 'Stablecoin yield, on Solana',
    headline: 'Your stablecoins, earning where rates are highest.',
    subheadline:
      'Move USDC and USDT from Ethereum, Arbitrum, Base, Polygon or Optimism into the top Solana yield strategies — in a single, transparent flow.',
    primaryCta: 'Start earning',
    secondaryCta: 'See how it works',
    trustLine: 'A finance product, not a crypto experiment.',
    trustPoints: [
      'See every fee, route, and APY before you confirm',
      'Your wallet, your keys — at every step',
      'Best-in-class execution on Solana, protected from MEV',
    ],
  },
  proofPoints: [
    {
      label: 'Source chains',
      value: '5 networks',
      detail: 'Bring stablecoins from Ethereum, Arbitrum, Base, Polygon or Optimism into Solana yield in one flow.',
    },
    {
      label: 'Yield destination',
      value: 'Top Solana vaults',
      detail: 'Capital lands in audited Kamino strategies — selected for liquidity, transparency and historical APY.',
    },
    {
      label: 'Average APY',
      value: '8.4% on USDC',
      detail: 'Live, market-driven yield from leading Solana vaults — updated continuously, never inflated.',
    },
  ],
  story: {
    eyebrow: 'Why SolGate',
    title: 'The simplest way to earn yield on Solana.',
    paragraphs: [
      'Today, earning real yield on stablecoins means juggling bridges, swaps, wallets and dashboards. Most of the return disappears into friction and confusion.',
      'SolGate replaces that with one clear path. Pick the chain you hold capital on, choose a vault, and confirm. The route, fees and final APY are visible up front — no hidden steps.',
      'It feels like a modern banking app, with the transparency and control of self-custody.',
    ],
    featuredAsset: '/marketing/portrait-finance-operator.svg',
  },
  howItWorks: [
    {
      step: '01',
      title: 'Connect your wallet',
      detail:
        'Link Solflare, Phantom or Backpack in a single click. We never touch your keys, and you can disconnect at any time.',
      callout: 'Self-custodial from the first tap.',
    },
    {
      step: '02',
      title: 'Pick a chain and amount',
      detail:
        'Choose where your stablecoins are today — Ethereum, Arbitrum, Base, Polygon or Optimism — and how much you want to put to work.',
      callout: 'Five networks, one familiar interface.',
    },
    {
      step: '03',
      title: 'Choose a yield vault',
      detail:
        'Browse curated Kamino strategies with live APY, total value locked, and risk profile. We surface what matters; you decide.',
      callout: 'Real numbers, no marketing math.',
    },
    {
      step: '04',
      title: 'Confirm one transaction',
      detail:
        'We bridge, swap and deposit in a single confirmation. The final step on Solana is sent through Jito for MEV protection.',
      callout: 'One signature. End-to-end execution.',
    },
    {
      step: '05',
      title: 'Track and withdraw anytime',
      detail:
        'Watch your position grow in your dashboard. Earnings compound automatically, and you can withdraw to any chain on demand.',
      callout: 'Always liquid. Always yours.',
    },
  ],
  partnerStack: [
    {
      partner: 'Solflare',
      role: 'Wallet & access',
      value:
        'Sign in with the most trusted Solana wallet — or use Phantom and Backpack. Your funds stay in your custody.',
      riskReduction: 'You hold the keys. Always.',
    },
    {
      partner: 'LI.FI',
      role: 'Cross-chain bridge',
      value:
        'Best-in-class routing moves your stablecoins from any major EVM chain to Solana, automatically and securely.',
      riskReduction: 'Audited routes, transparent fees.',
    },
    {
      partner: 'DFlow',
      role: 'Smart swaps',
      value:
        'Order routing finds the deepest liquidity and best execution price the moment your capital arrives on Solana.',
      riskReduction: 'No surprise slippage at the final step.',
    },
    {
      partner: 'Kamino',
      role: 'Yield vaults',
      value:
        'Your capital lands in leading Solana vaults — automated strategies built and audited by one of the largest DeFi teams.',
      riskReduction: 'Battle-tested protocols, real APY.',
    },
    {
      partner: 'Jito',
      role: 'MEV protection',
      value:
        'Your final deposit is bundled and protected from front-running, so you receive the price you saw — not a worse one.',
      riskReduction: 'Same execution institutions use.',
    },
    {
      partner: 'QuickNode',
      role: 'Solana infrastructure',
      value:
        'Enterprise-grade nodes power balance, fee and transaction data — so what you see in the app is always live and accurate.',
      riskReduction: '99.99% uptime, real-time data.',
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
