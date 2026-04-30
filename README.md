# SolGate

SolGate is a stablecoin yield terminal for moving capital into Solana vaults with clear routing, MEV-aware execution, optional privacy, and local route review before signing.

## Product

Users choose a source chain, stablecoin, vault, and privacy preference. SolGate quotes the route, explains the movement in plain language, checks route confidence, then executes bridge, swap, and vault deposit steps through the configured providers.

## Current capabilities

- Cross-chain stablecoin quotes and bridging through LI.FI.
- Stablecoin conversion through DFlow before vault entry when needed.
- Kamino vault discovery and deposit preparation.
- Jito bundle submission for MEV-aware Solana execution.
- Solflare-first Solana wallet connection with EVM wallet support for source-chain transactions.
- USDC, USDT, and Palm USD route metadata, including Palm USD public circulation data.
- GoldRush route confidence checks for balances, recent activity, and EVM approvals.
- Optional Cloak and Umbra privacy modes, lazy-loaded only when selected.
- Local QVAC route reviewer through a user-run local service.
- Supabase-backed user data, positions, and transaction history.

## Tech stack

- React 18, Vite 6, Tailwind CSS, React Router.
- Supabase for auth and persistence.
- Solana wallet adapter, Solflare adapter, `@solana/web3.js`, and SPL token utilities.
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

The reviewer runs locally at `http://127.0.0.1:8787` by default. It uses deterministic local review unless `QVAC_REVIEWER_ENABLE_MODEL=true` is set, in which case it loads QVAC locally. Deposits still work without the reviewer; the UI shows the local review as unavailable instead of using fake output.

## Environment

Copy `.env.example` to `.env.local` and configure only the providers you intend to use. Real production routes require provider API keys/RPC URLs and `VITE_USE_MOCK_DATA=false`.

Key groups:

- Supabase: auth, positions, transactions.
- Quicknode: Solana RPC and WebSocket subscriptions.
- LI.FI and DFlow: route quote, bridge, and swap execution.
- Jito: bundle submission.
- Palm USD: public circulation API.
- GoldRush: route confidence API.
- Cloak and Umbra: optional privacy modes.
- QVAC: local route reviewer URL.

## Database

Run `supabase/schema.sql` in Supabase to create:

- `user_settings`
- `positions`
- `transactions`

Row Level Security is enabled for user-owned data.

## Documentation

- `.docs/SOLGATE_MASTER_PLAN.md` — current product and track strategy.
- `.docs/SOLGATE_TRACK_IMPLEMENTATION_PLAN.md` — implementation plan for Palm USD, GoldRush, Cloak, Umbra, and QVAC.
- `.docs/SOLGATE_FRONTIER_SIDE_TRACK_REPORT.md` — side-track fit analysis.

## License

MIT
