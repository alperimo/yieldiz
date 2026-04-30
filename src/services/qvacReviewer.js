const QVAC_REVIEWER_URL = import.meta.env.VITE_QVAC_REVIEWER_URL || 'http://127.0.0.1:8787';

export async function getReviewerHealth({ signal } = {}) {
  const res = await fetch(`${QVAC_REVIEWER_URL}/health`, { signal });
  if (!res.ok) throw new Error(`Local route check unavailable (${res.status})`);
  return res.json();
}

export async function reviewRoute(routeIntent, { signal } = {}) {
  const res = await fetch(`${QVAC_REVIEWER_URL}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ routeIntent }),
    signal,
  });

  if (!res.ok) throw new Error(`Local route check failed (${res.status})`);
  return res.json();
}

