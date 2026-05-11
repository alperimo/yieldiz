const QVAC_REVIEWER_URL = import.meta.env.VITE_QVAC_REVIEWER_URL || '';
const USE_REMOTE_REVIEWER = import.meta.env.VITE_QVAC_REVIEWER_REMOTE === 'true' && Boolean(QVAC_REVIEWER_URL);

function createBrowserReview(routeIntent) {
  const amount = Number(routeIntent?.amount || 0);
  const fromChain = routeIntent?.fromChain || 'selected chain';
  const fromToken = routeIntent?.fromToken || 'asset';
  const toToken = routeIntent?.toToken || fromToken;
  const needsBridge = routeIntent?.requiresBridge;
  const needsSwap = routeIntent?.requiresSwap;
  const quoteAvailable = Boolean(routeIntent?.quote);
  const benefitCampaign = routeIntent?.benefitCampaign;
  const hasPrivacy = routeIntent?.privacyMode && routeIntent.privacyMode !== 'standard';
  const considerations = [
    needsBridge ? `bridging from ${fromChain}` : 'same-chain Solana routing',
    needsSwap ? `${fromToken} to ${toToken} conversion` : `${toToken} direct deposit`,
    quoteAvailable ? 'live quote available' : 'live quote unavailable',
    benefitCampaign ? `${benefitCampaign.name || 'benefit campaign'} metadata attached` : null,
  ].filter(Boolean);

  return {
    summary: `${amount || 'Selected'} ${fromToken} route reviewed locally in the browser.`,
    mainRisk: quoteAvailable
      ? `Check wallet approval, slippage, and ${considerations.join(', ')} before signing.`
      : 'Live provider quote is unavailable, so treat this as an intent review only and do not sign a live transaction until quote data loads.',
    recommendation: quoteAvailable
      ? 'Proceed only if wallet addresses, destination vault, and expected output match your intent.'
      : 'Connect required wallets or enable mock mode for a demo; no local QVAC server is required for this browser review.',
    privacyNote: benefitCampaign
      ? `${benefitCampaign.incentive} Qualification still depends on completing the route.`
      : hasPrivacy
        ? 'Privacy mode protects the pre-route movement; the vault deposit still settles on-chain.'
        : null,
    available: true,
    mode: 'browser-local',
  };
}

export async function getReviewerHealth({ signal } = {}) {
  if (!USE_REMOTE_REVIEWER) {
    return { available: true, mode: 'browser', reason: 'Browser-local route review is active.' };
  }

  const res = await fetch(`${QVAC_REVIEWER_URL}/health`, { signal });
  if (!res.ok) throw new Error(`Local route check unavailable (${res.status})`);
  return res.json();
}

export async function reviewRoute(routeIntent, { signal } = {}) {
  if (!USE_REMOTE_REVIEWER) {
    return createBrowserReview(routeIntent);
  }

  const res = await fetch(`${QVAC_REVIEWER_URL}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ routeIntent }),
    signal,
  });

  if (!res.ok) throw new Error(`Local route check failed (${res.status})`);
  return res.json();
}
