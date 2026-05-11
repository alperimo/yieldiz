const BENEFIT_TRIGGERS = new Set([
  'wallet-placement',
  'wallet_placement',
  'themiracle',
  'benefit',
]);

export const WALLET_PLACEMENT_BENEFIT = {
  id: 'wallet-placement-benefit',
  name: 'Wallet benefit',
  audience: 'DeFi-active stablecoin wallets with meaningful USDC or USDT balances.',
  action: 'Review and complete a first Yieldiz route into a Solana vault.',
  incentive: 'First 500 qualified wallets receive a $10 Yieldiz route-credit budget.',
  value: 'Start from a wallet prompt and end with a reviewed, trackable Solana yield position.',
  totalPerceivedValue: 5000,
  maxQualifiedWallets: 500,
};

function normalize(value) {
  return String(value || '').trim().toLowerCase();
}

export function getBenefitCampaignFromSearchParams(searchParams) {
  if (!searchParams) return null;

  const benefit = normalize(searchParams.get('benefit'));
  const source = normalize(searchParams.get('utm_source'));
  const campaign = normalize(searchParams.get('utm_campaign'));

  const active =
    BENEFIT_TRIGGERS.has(benefit) ||
    source === 'themiracle' ||
    campaign.includes('benefit') ||
    campaign.includes('wallet-placement') ||
    campaign.includes('wallet_placement');

  if (!active) return null;

  return {
    ...WALLET_PLACEMENT_BENEFIT,
    source: source || 'wallet',
    campaign: campaign || benefit || WALLET_PLACEMENT_BENEFIT.id,
  };
}

export function serializeBenefitCampaign(campaign) {
  if (!campaign) return null;

  return {
    id: campaign.id,
    name: campaign.name,
    source: campaign.source,
    campaign: campaign.campaign,
    audience: campaign.audience,
    action: campaign.action,
    incentive: campaign.incentive,
    value: campaign.value,
    total_perceived_value: campaign.totalPerceivedValue,
    max_qualified_wallets: campaign.maxQualifiedWallets,
  };
}
