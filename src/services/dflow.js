// DFlow Swap Service
// Declarative trade routing with MEV-resistant execution
// Docs: https://pond.dflow.net/build
import { YIELDIZ_PLATFORM_FEE_BPS } from '../lib/monetization';

const DFLOW_DEV_API = 'https://dev-quote-api.dflow.net';
const DFLOW_PROD_API = 'https://quote-api.dflow.net';

function getBaseUrl() {
  return import.meta.env.VITE_DFLOW_API_KEY ? DFLOW_PROD_API : DFLOW_DEV_API;
}

function getHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  const key = import.meta.env.VITE_DFLOW_API_KEY;
  if (key) headers['x-api-key'] = key;
  return headers;
}

export async function getSwapQuote({ inputMint, outputMint, amount, slippageBps = 50, platformFeeBps }) {
  const body = { inputMint, outputMint, amount: String(amount), slippageBps };
  if (platformFeeBps) body.platformFeeBps = platformFeeBps;

  const res = await fetch(`${getBaseUrl()}/v1/quote`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`DFlow quote error: ${res.status}`);
  return res.json();
}

export async function getSwapTransaction({ inputMint, outputMint, amount, userPublicKey, slippageBps = 50 }) {
  const quote = await getSwapQuote({
    inputMint,
    outputMint,
    amount,
    slippageBps,
    platformFeeBps: YIELDIZ_PLATFORM_FEE_BPS,
  });

  const res = await fetch(`${getBaseUrl()}/v1/swap`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      quoteResponse: quote,
      userPublicKey,
    }),
  });
  if (!res.ok) throw new Error(`DFlow swap error: ${res.status}`);
  return res.json();
}
