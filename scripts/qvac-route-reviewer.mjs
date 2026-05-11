import http from 'node:http';

const HOST = process.env.QVAC_REVIEWER_HOST || '127.0.0.1';
const PORT = Number(process.env.QVAC_REVIEWER_PORT || 8787);
const ENABLE_MODEL = process.env.QVAC_REVIEWER_ENABLE_MODEL === 'true';

let qvacState = {
  loaded: false,
  modelId: null,
  sdk: null,
  error: null,
};

async function loadQvac() {
  if (qvacState.loaded || qvacState.error) return qvacState;

  try {
    const sdk = await import('@qvac/sdk');
    const modelSrc = sdk.LLAMA_3_2_1B_INST_Q4_0 || sdk.getModelByName?.('LLAMA_3_2_1B_INST_Q4_0');
    if (!modelSrc) throw new Error('QVAC route reviewer model is not available in this SDK build.');

    const modelId = await sdk.loadModel({
      modelSrc,
      modelType: 'llm',
      onProgress: (progress) => {
        if (process.env.QVAC_REVIEWER_VERBOSE === 'true') console.log(progress);
      },
    });

    qvacState = { loaded: true, modelId, sdk, error: null };
  } catch (error) {
    qvacState = { loaded: false, modelId: null, sdk: null, error: error.message };
  }

  return qvacState;
}

function json(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': 'http://localhost:5173',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(body));
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function deterministicReview(routeIntent) {
  const amount = Number(routeIntent?.amount || 0);
  const fromToken = routeIntent?.fromToken || 'stablecoin';
  const toToken = routeIntent?.toToken || fromToken;
  const fromChain = routeIntent?.fromChain || 'source wallet';
  const hasPrivacy = routeIntent?.privacyMode && routeIntent.privacyMode !== 'standard';
  const requiresBridge = routeIntent?.requiresBridge;
  const requiresSwap = routeIntent?.requiresSwap || fromToken !== toToken;
  const benefitCampaign = routeIntent?.benefitCampaign;

  return {
    summary: `${amount || 'Your'} ${fromToken} ${requiresBridge ? `moves from ${fromChain} to Solana` : 'stays on Solana'}${requiresSwap ? `, converts to ${toToken},` : ''} and enters the selected vault.`,
    mainRisk: requiresSwap
      ? 'Confirm the final received amount and slippage before signing.'
      : 'Confirm the vault and route timing before signing.',
    privacyNote: hasPrivacy
      ? 'Privacy mode protects the pre-route movement; the vault deposit still settles on-chain.'
      : 'This is a standard on-chain route after confirmation.',
    recommendation: benefitCampaign
      ? `Proceed only if the route matches your intent; completing it attaches ${benefitCampaign.name || 'benefit'} metadata for qualification.`
      : 'Proceed only if the shown amount, fees, and destination match your intent.',
    source: 'deterministic',
  };
}

async function qvacReview(routeIntent) {
  if (!ENABLE_MODEL) return deterministicReview(routeIntent);

  const state = await loadQvac();
  if (!state.loaded) return deterministicReview(routeIntent);

  const prompt = [
    'You are a concise local financial route reviewer for Yieldiz.',
    'Explain this deposit route to a user in JSON only.',
    'Return keys: summary, mainRisk, privacyNote, recommendation.',
    'Do not mention SDKs, sponsors, or implementation details.',
    `Route: ${JSON.stringify(routeIntent)}`,
  ].join('\n');

  const result = state.sdk.completion({
    modelId: state.modelId,
    history: [{ role: 'user', content: prompt }],
    stream: false,
  });

  const text = typeof result === 'string' ? result : await result;
  try {
    return { ...JSON.parse(text), source: 'qvac' };
  } catch {
    return { ...deterministicReview(routeIntent), source: 'qvac-fallback' };
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return json(res, 204, {});

  try {
    if (req.method === 'GET' && req.url === '/health') {
      return json(res, 200, {
        available: true,
        modelEnabled: ENABLE_MODEL,
        qvacLoaded: qvacState.loaded,
        fallback: !qvacState.loaded,
        error: qvacState.error,
      });
    }

    if (req.method === 'POST' && req.url === '/review') {
      const body = await readJson(req);
      if (!body.routeIntent) return json(res, 400, { error: 'routeIntent is required' });
      const review = await qvacReview(body.routeIntent);
      return json(res, 200, review);
    }

    return json(res, 404, { error: 'Not found' });
  } catch (error) {
    return json(res, 500, { error: error.message });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Yieldiz local route reviewer listening on http://${HOST}:${PORT}`);
});
