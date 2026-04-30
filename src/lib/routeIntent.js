import { PRIVACY_MODES, getStablecoin } from './stablecoins';

export function createRouteIntent({
  fromChain,
  fromToken,
  toToken,
  amount,
  vault,
  privacyMode = PRIVACY_MODES.STANDARD,
  quote = null,
}) {
  const source = getStablecoin(fromToken);
  const destination = getStablecoin(toToken);

  return {
    fromChain,
    fromToken,
    toToken,
    amount: Number(amount || 0),
    vault,
    privacyMode,
    quote,
    sourceToken: source,
    destinationToken: destination,
    requiresBridge: fromChain !== 'solana',
    requiresSwap: Boolean(source && destination && source.symbol !== destination.symbol),
    createdAt: new Date().toISOString(),
  };
}

export function summarizeRouteIntent(intent) {
  if (!intent) return null;

  const steps = [];
  if (intent.requiresBridge) {
    steps.push(`${intent.fromToken} moves from ${intent.fromChain} to Solana`);
  }
  if (intent.requiresSwap) {
    steps.push(`${intent.fromToken} converts to ${intent.toToken}`);
  }
  steps.push(`${intent.toToken} enters the selected vault`);

  return {
    headline: `${intent.amount || 0} ${intent.fromToken} to Solana yield`,
    steps,
    privacyMode: intent.privacyMode,
    hasPrivacy: intent.privacyMode !== PRIVACY_MODES.STANDARD,
  };
}

