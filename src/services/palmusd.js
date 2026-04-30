const configuredPalmUsdApi = import.meta.env.VITE_PALMUSD_API_BASE || '';
const PALMUSD_API = configuredPalmUsdApi && configuredPalmUsdApi !== 'https://api.palmusd.com'
  ? configuredPalmUsdApi.replace(/\/$/, '')
  : '';

export async function getCirculation({ exclude } = {}) {
  if (!PALMUSD_API) {
    throw new Error('Palm USD circulation API is not configured.');
  }

  const params = new URLSearchParams();
  if (exclude?.length) params.set('exclude', exclude.join(','));

  const res = await fetch(`${PALMUSD_API}/v1/circulation${params.size ? `?${params}` : ''}`, {
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) {
    let detail = '';
    try {
      const body = await res.json();
      detail = body?.error?.message ? `: ${body.error.message}` : '';
    } catch {
      detail = '';
    }
    throw new Error(`Palm USD circulation unavailable (${res.status})${detail}`);
  }

  return res.json();
}

export function normalizeCirculation(payload) {
  const chains = Array.isArray(payload?.chains) ? payload.chains : [];
  return {
    total: Number(payload?.total_circulating || 0),
    chains: chains.map((item) => ({
      chain: item.chain,
      circulating: Number(item.circulating || 0),
    })),
  };
}
