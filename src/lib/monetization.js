const MAX_PLATFORM_FEE_BPS = 100;

function parseBps(value) {
  const parsed = Number(value ?? 0);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return Math.min(Math.round(parsed), MAX_PLATFORM_FEE_BPS);
}

export const YIELDIZ_PLATFORM_FEE_BPS = parseBps(import.meta.env.VITE_YIELDIZ_PLATFORM_FEE_BPS);
export const YIELDIZ_PLATFORM_FEE_RATE = YIELDIZ_PLATFORM_FEE_BPS / 10_000;

export function isPlatformFeeEnabled() {
  return YIELDIZ_PLATFORM_FEE_BPS > 0;
}

export function calculatePlatformFee(amount) {
  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount) || numericAmount <= 0 || !isPlatformFeeEnabled()) return 0;
  return Number((numericAmount * YIELDIZ_PLATFORM_FEE_RATE).toFixed(6));
}

export function formatPlatformFeeRate() {
  return `${(YIELDIZ_PLATFORM_FEE_BPS / 100).toFixed(2)}%`;
}

export function applyPlatformFeeToQuote(quote) {
  if (!quote) return quote;

  const platformFee = calculatePlatformFee(quote.fromAmount);
  if (!platformFee) {
    return { ...quote, platformFee: 0, platformFeeBps: YIELDIZ_PLATFORM_FEE_BPS };
  }

  return {
    ...quote,
    platformFee,
    platformFeeBps: YIELDIZ_PLATFORM_FEE_BPS,
    toAmount: Math.max(0, Number(quote.toAmount || 0) - platformFee),
  };
}

