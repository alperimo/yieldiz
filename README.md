# Yieldiz

**A stablecoin yield terminal for Solana.** Yieldiz routes idle stablecoins from any supported chain into Solana vaults with one reviewed flow: quote, cost, settlement path, and privacy boundary are all shown before the user signs.

> Default monetization is `0 bps`; the platform fee path is wired and gated behind an env var for post-launch activation.

---

## What it does

1. **Choose** a source chain, stablecoin, vault, and privacy preference.
2. **Review** the full route locally — bridge, swap, fees, APY, settlement path, privacy mode — before any signature.
3. **Execute** bridge → swap → vault deposit through the configured providers.
4. **Track** confirmed positions and history in the dashboard.

The product layer between idle stablecoins and Solana yield. Non-custodial. Audited vaults only. Nothing moves until the user approves the reviewed route.

---

## Capabilities

| Area | Implementation |
|---|---|
| Cross-chain bridging | LI.FI (multi-chain stablecoin liquidity) |
| Stablecoin conversion | DFlow swap routing |
| Vault discovery & deposit | Kamino vaults with KTX deposit prep |
| MEV-aware settlement | Jito bundle submission with explicit fallback |
| Solana RPC | QuickNode (HTTP + WebSocket) |
| Wallets | Solana wallet adapter (Phantom, Solflare, Backpack, …) + EVM (`viem`) for source chains |
| Stablecoin coverage | USDC, USDT, Palm USD, USDG with public-source circulation metadata |
| Route confidence | GoldRush balance, activity, and EVM-approval checks |
| Privacy modes (optional, lazy-loaded) | Cloak (private treasury route), Umbra (private balance route) |
| Identity | SNS primary `.sol` resolution for connected wallets |
| Local review | Deterministic browser-local reviewer; optional `@qvac/sdk` local-model service |
| Persistence | Supabase (positions, transactions, settings) with RLS |

---

## Tech stack

- **Frontend** — React 18, Vite 6, Tailwind CSS, React Router 6, TanStack Query, GSAP.
- **Solana** — `@solana/web3.js`, `@solana/kit`, `@solana/spl-token`, `@solana/wallet-adapter-*`, `@bonfida/spl-name-service`.
- **EVM** — `viem` for source-chain reads and approvals.
- **Integrations** — `@lifi/sdk`, `@cloak.dev/sdk`, `@umbra-privacy/sdk` (+ web zk prover), `@qvac/sdk`, `@supabase/supabase-js`.
- **Infra** — Cloudflare Pages (static SPA, global CDN, wallet-popup-friendly headers).

---

## Quick start

```bash
npm install
cp .env.example .env.local       # fill only the providers you need
npm run dev                      # http://localhost:5173
```

For a fully free, end-to-end product walkthrough without any provider credentials, set `VITE_USE_MOCK_DATA=true` in `.env.local`. Production builds default to live data.

---

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Vite dev server with HMR. |
| `npm run build` | Production build to `dist/`. |
| `npm run preview` | Preview the production build locally. |
| `npm run deploy:cloudflare` | Build and deploy to Cloudflare Pages (`wrangler`). |
| `npm run deploy:netlify` | Build and deploy to Netlify. |
| `npm run qvac:reviewer` | Start the optional local QVAC route-review service on `127.0.0.1:8787`. |

---

## Project structure

```text
src/
  components/      UI, layout, deposit, dashboard, vault components
  content/         Marketing and product copy
  context/         Wallet and app-wide providers
  hooks/           Data, route, execution, persistence hooks
  lib/             Constants, formatters, route models, stablecoin metadata
  pages/           Marketing, /app, /dashboard, /vaults
  services/        Provider clients (LI.FI, DFlow, Kamino, Jito, QuickNode,
                   GoldRush, Cloak, Umbra, SNS, QVAC, Supabase)
  styles/          Theme, tokens, global styles
  config.js        Runtime config and feature flags
scripts/
  qvac-route-reviewer.mjs    Local QVAC service entry
supabase/
  schema.sql                 user_settings, positions, transactions (+ RLS)
public/
  _redirects                 SPA rewrite to index.html
  _headers                   Cache + minimal security headers (no COOP/COEP)
wrangler.toml                Cloudflare Pages target = dist/
```

---

## Environment

Copy `.env.example` to `.env.local`. Configure only the providers you intend to use; live routes require credentials and `VITE_USE_MOCK_DATA=false`.

| Group | Variables | Notes |
|---|---|---|
| Network | `VITE_NETWORK` | `devnet` or `mainnet-beta`. Most provider routes are mainnet-first. |
| Mock mode | `VITE_USE_MOCK_DATA` | `true` = full UX walkthrough with no credentials. |
| Demo mode | `VITE_DEMO_MODE` | Dev-only recording mode. The user still connects a real Solana wallet; after connection the app uses mock source balances, mock route confidence, mock execution, and browser-local dashboard persistence. Set `VITE_USE_MOCK_DATA=false` to keep live Kamino vault discovery. |
| Supabase | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_SUPABASE_AUTH_MODE` | Use `anonymous` only after enabling anonymous sign-ins. |
| Solana RPC | `VITE_QUICKNODE_RPC_URL`, `VITE_QUICKNODE_WSS_URL` | Required for live Solana reads. |
| Bridge / swap | `VITE_LIFI_INTEGRATOR`, `VITE_DFLOW_API_KEY` | DFlow key optional in dev. |
| MEV settlement | `VITE_JITO_BLOCK_ENGINE_URL` | Mainnet block engine. |
| Stablecoin data | `VITE_PALMUSD_API_BASE` | Optional public circulation feed. |
| Route confidence | `VITE_GOLDRUSH_API_KEY`, `VITE_GOLDRUSH_API_BASE` | |
| Privacy | `VITE_CLOAK_RELAY_URL`, `VITE_CLOAK_CIRCUITS_BASE_URL`, `VITE_UMBRA_NETWORK`, `VITE_UMBRA_INDEXER_API`, `VITE_UMBRA_RELAYER_API` | SDKs are lazy-loaded only when the user picks the privacy mode. |
| Local review | `VITE_QVAC_REVIEWER_REMOTE`, `VITE_QVAC_REVIEWER_URL`, `QVAC_REVIEWER_ENABLE_MODEL` | Default review runs in-browser; remote service is optional. |
| Monetization | `VITE_YIELDIZ_PLATFORM_FEE_BPS` | `0` for beta. Recommended post-launch: `10` (0.10% on completed deposits). |

---

## Privacy modes

The deposit screen offers three explicitly labeled paths:

- **Standard route** — public bridge, swap, and vault deposit after signing.
- **Private treasury route** — Cloak loaded on demand. Pre-route treasury movement before funds enter the public vault path.
- **Private balance route** — Umbra loaded on demand. Encrypted balance handling before the deposit route.

**Boundary.** Yieldiz does not claim Kamino vault deposits themselves are private — the final settlement is on-chain. Privacy applies to the segment **before** the public vault route. Until a Cloak/Umbra shield-and-withdraw flow is validated on the target network, non-standard modes are presented as setup paths and direct deposit confirmation is held back to avoid implying false privacy.

---

## Database

`supabase/schema.sql` provisions:

- `user_settings`
- `positions`
- `transactions`

Row Level Security is enabled for all user-owned data. Without Supabase, the app falls back to a local wallet session so no auth errors surface. Enable Supabase anonymous auth and set `VITE_SUPABASE_AUTH_MODE=anonymous` to persist confirmed deposits and history.

---

## Deployment

Yieldiz is a static Vite SPA. **Cloudflare Pages** is the recommended host: free global CDN, automatic HTTPS, SPA-friendly rewrites, immutable asset caching, and no headers that would break wallet popups or injected providers (we intentionally avoid strict COOP/COEP/CSP).

**Connect-to-Git:**

1. Push to GitHub.
2. Cloudflare → Workers & Pages → Pages → Connect to Git.
3. Build command: `npm run build` · Output directory: `dist`.
4. Add `VITE_*` environment variables (Cloudflare injects them at build time — re-deploy after changes).
5. Attach a custom domain.

**CLI:**

```bash
npm run deploy:cloudflare
```

Provided files: `public/_redirects`, `public/_headers`, `wrangler.toml`.

---

## Testing flow

1. **Recorded demo walkthrough** — `VITE_DEMO_MODE=true`, `VITE_USE_MOCK_DATA=false`, run `npm run dev`, connect your own wallet, then record `/app`. Vaults are live, while source balances, route confidence, execution, and dashboard tracking are deterministic.
2. **Free product walkthrough** — `VITE_USE_MOCK_DATA=true`, run `npm run dev`, connect any wallet, walk through `/app` end-to-end with mocked routes.
3. **Persistence** — Provision Supabase, run `supabase/schema.sql`, enable anonymous auth, set the three Supabase env vars. Confirmed deposits land in `positions` and `transactions`.
4. **Live providers** — Switch to `VITE_USE_MOCK_DATA=false` and `VITE_NETWORK=mainnet-beta`. Validate one provider path at a time: quote → confidence → privacy load → local review → bridge/swap/deposit → dashboard.

---

## Documentation

In-repo planning and submission documents live under `.docs/` (legacy filenames retained for git history):

- `YIELDIZ_FRONTIER_SUBMISSION_PACK.md` — Frontier submission pack and pitch deck plan.
- `SOLGATE_MASTER_PLAN.md` — product and architecture plan.
- `SOLGATE_TRACK_IMPLEMENTATION_PLAN.md` — Palm USD, GoldRush, Cloak, Umbra, QVAC implementation plan.
- `SOLGATE_FRONTIER_SIDE_TRACK_REPORT.md` — side-track fit analysis.
- `SPRINT_REPORT.md` — sprint-by-sprint progress.

---

## License

MIT
