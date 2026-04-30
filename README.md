# SolGate

SolGate is a stablecoin yield terminal for moving capital into Solana vaults with clear routing, MEV-aware execution, optional privacy, and local route review before signing.

## Product

Users choose a source chain, stablecoin, vault, and privacy preference. SolGate quotes the route, explains the movement in plain language, checks route confidence, then executes bridge, swap, and vault deposit steps through the configured providers.

## Current capabilities

- Cross-chain stablecoin quotes and bridging through LI.FI.
- Stablecoin conversion through DFlow before vault entry when needed.
- Kamino vault discovery and deposit preparation.
- Jito bundle submission for MEV-aware Solana execution.
- Standard-wallet Solana connection with EVM wallet support for source-chain transactions.
- USDC, USDT, and Palm USD route metadata, with Palm USD circulation shown when a reachable provider endpoint is configured.
- GoldRush route confidence checks for balances, recent activity, and EVM approvals.
- Optional Cloak and Umbra privacy modes, lazy-loaded only when selected.
- Browser-local route reviewer, with optional QVAC service mode for user-run local model review.
- Supabase-backed user data, positions, and transaction history.

## What can be tested for free?

You can test the full UX, mocked deposit flow, browser-local route review, dashboard layout, and Supabase persistence on free/dev tiers.

You cannot prove every real money movement for free on devnet because several providers are mainnet-first or require real API credentials:

- LI.FI routes use live bridge liquidity and are normally mainnet-focused.
- Kamino production vaults and KTX deposit routes are mainnet-oriented.
- Jito bundle submission is a mainnet block-engine path.
- GoldRush needs an API key for route confidence.
- Cloak/Umbra demo paths depend on their supported networks, relayers, indexers, and wallet adapter support.
- QVAC model mode is local but requires Node >= 22.17 and local model load time/resources.

Use `VITE_USE_MOCK_DATA=true` for a free end-to-end product walkthrough. Use `VITE_USE_MOCK_DATA=false` only when real credentials and funded test/mainnet wallets are ready.

## Tech stack

- React 18, Vite 6, Tailwind CSS, React Router.
- Supabase for auth and persistence.
- Solana wallet adapter, `@solana/web3.js`, and SPL token utilities.
- LI.FI, DFlow, Kamino, Jito, Quicknode, Palm USD, GoldRush, Cloak, Umbra, and QVAC integrations.

## Project structure

```text
src/
  components/      UI, layout, deposit, dashboard, and vault components
  context/         Wallet connection state
  hooks/           App data and execution hooks
  lib/             Constants, formatters, stablecoin and route models
  pages/           Marketing, deposit, dashboard, and vault pages
  services/        Provider/API clients
  styles/          Global styles and theme
scripts/
  qvac-route-reviewer.mjs
supabase/
  schema.sql
```

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Production build:

```bash
npm run build
```

Local QVAC reviewer:

```bash
npm run qvac:reviewer
```

By default, the app performs deterministic browser-local route review and does not call `127.0.0.1`. To use the optional QVAC local service, set `VITE_QVAC_REVIEWER_REMOTE=true`, set `VITE_QVAC_REVIEWER_URL=http://127.0.0.1:8787`, then run `npm run qvac:reviewer`. Set `QVAC_REVIEWER_ENABLE_MODEL=true` only when you want the local QVAC model path.

## Testing flow

1. **Free product walkthrough**
   - Set `VITE_USE_MOCK_DATA=true`.
   - Start `npm run dev`.
   - Open `/`, then `/app`.
   - Connect a wallet, choose a source chain/token/vault, review privacy options, run the browser-local route review, and complete the mocked deposit.

2. **Supabase persistence**
   - Create a free Supabase project.
   - Enable anonymous sign-ins in Supabase Auth.
   - Run `supabase/schema.sql` in the SQL editor.
   - Set `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_SUPABASE_AUTH_MODE=anonymous`.
   - Complete a deposit flow; confirmed deposits are stored in `positions` and `transactions` when Supabase auth is active.

3. **Real provider validation**
   - Set `VITE_USE_MOCK_DATA=false`.
   - Set `VITE_NETWORK=mainnet-beta` and configure a mainnet Solana RPC/wallet before attempting live Kamino deposits.
   - Configure Quicknode, GoldRush, DFlow, LI.FI integrator, Jito, Cloak/Umbra, and any required wallet/network credentials.
   - Validate one provider path at a time: quote, route confidence, privacy mode load, local review, bridge/swap/deposit, then dashboard persistence.

## Privacy modes

The deposit screen has three privacy choices:

- **Standard route** — fastest path; bridge/swap/deposit are public after signing.
- **Private treasury route** — loads Cloak only when selected. It is intended for private pre-route treasury movement before funds enter the public vault route.
- **Private balance route** — loads Umbra only when selected. It is intended for encrypted balance handling before withdrawing into the deposit route.

Important boundary: SolGate does not claim Kamino vault deposits are private. Privacy applies before the public vault route; the final vault deposit still settles on-chain. Until a Cloak/Umbra shield-and-withdraw demo is validated on the target network, non-standard privacy modes are presented as setup paths and direct deposit confirmation remains blocked to avoid implying false privacy.

## Environment

Copy `.env.example` to `.env.local` and configure only the providers you intend to use. Real production routes require provider API keys/RPC URLs and `VITE_USE_MOCK_DATA=false`.

Key groups:

- Supabase: optional anonymous auth, positions, transactions.
- Quicknode: Solana RPC and WebSocket subscriptions.
- LI.FI and DFlow: route quote, bridge, and swap execution.
- Jito: bundle submission.
- Palm USD: public circulation API.
- GoldRush: route confidence API.
- Cloak and Umbra: optional privacy modes.
- QVAC: optional local route reviewer URL; browser-local review works without it.

## Database

Run `supabase/schema.sql` in Supabase to create:

- `user_settings`
- `positions`
- `transactions`

Row Level Security is enabled for user-owned data. By default, the app uses a local wallet session so projects without Supabase anonymous auth do not emit auth errors. Set `VITE_SUPABASE_AUTH_MODE=anonymous` after enabling anonymous sign-ins to persist confirmed deposit snapshots and transaction history for the dashboard.

## Documentation

- `.docs/SOLGATE_MASTER_PLAN.md` — current product and architecture plan.
- `.docs/SOLGATE_TRACK_IMPLEMENTATION_PLAN.md` — implementation plan for Palm USD, GoldRush, Cloak, Umbra, and QVAC.
- `.docs/SOLGATE_FRONTIER_SIDE_TRACK_REPORT.md` — side-track fit analysis.

## License

MIT
