import { useEffect, useMemo, useState } from 'react';
import { MARKETING_CONTENT } from '../content/marketing';

// Single source of truth for marketing-surface platform metrics.
// Today this hydrates from the marketing content module so the UI is fully
// declarative. To go live, set VITE_PLATFORM_METRICS_ENDPOINT and the hook
// will fetch from it without any change to consuming components.
//
// The shape returned mirrors what each marketing surface needs:
// - hero      : the three Live chips next to the headline
// - liveGrid  : the larger 5-up tile grid in the dark "Real capital" section
// - status    : 'idle' | 'loading' | 'live' | 'fallback'
// - updatedAt : ISO timestamp (used for the "as of …" line, when wired)

const ENDPOINT = import.meta.env.VITE_PLATFORM_METRICS_ENDPOINT;

const fallbackPayload = () => ({
  hero: MARKETING_CONTENT.hero.live,
  liveGrid: MARKETING_CONTENT.liveMetrics,
  updatedAt: null,
});

export const usePlatformMetrics = () => {
  const fallback = useMemo(fallbackPayload, []);
  const [state, setState] = useState({
    ...fallback,
    status: ENDPOINT ? 'loading' : 'fallback',
  });

  useEffect(() => {
    if (!ENDPOINT) return undefined;
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(ENDPOINT, { headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error(`metrics ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        setState({
          hero: Array.isArray(data?.hero) ? data.hero : fallback.hero,
          liveGrid: Array.isArray(data?.liveGrid) ? data.liveGrid : fallback.liveGrid,
          updatedAt: data?.updatedAt ?? new Date().toISOString(),
          status: 'live',
        });
      } catch {
        if (cancelled) return;
        setState({ ...fallback, status: 'fallback' });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [fallback]);

  return state;
};
