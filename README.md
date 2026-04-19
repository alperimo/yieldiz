# SolGate — Cross-Chain Smart Yield Terminal

> Bridge stablecoins from any chain to Solana's best yield vaults. One wallet. One click. Maximum yield. Zero MEV loss.

## The Problem

Users hold stablecoins across multiple blockchains earning 0% yield. Moving them to Solana's best vaults requires 4+ manual steps — each exposing users to MEV attacks, slippage, and friction.

## The Solution

SolGate is a single-screen terminal that:

1. **Detects** cross-chain stablecoin balances
2. **Bridges** from any EVM chain to Solana via optimal route (LI.FI)
3. **Routes** into the highest-yield Kamino vault
4. **Executes** everything MEV-protected via Jito Bundles

## Architecture

```
src/
├── components/
│   ├── ui/          # Button, Card, Input, Badge, Spinner, Toast, Modal, DataTable
│   ├── layout/      # Layout, Sidebar, Header, MobileNav
│   ├── deposit/     # DepositFlow, AmountInput, ChainSelector, VaultSelector
│   ├── dashboard/   # PortfolioSummary, PositionsTable, TransactionHistory
│   └── vaults/      # VaultCard, VaultList, VaultFilters
├── pages/           # Deposit (home), Dashboard, Vaults
├── hooks/           # useVaults, usePositions, useTransactions, useBridgeQuote, useDepositFlow, usePrices
├── services/        # kamino, dflow, lifi, jito, quicknode
├── lib/             # Supabase client, auth context, formatters, constants
├── context/         # WalletContext
├── types/           # JSDoc typedefs
└── styles/          # theme.css (CSS custom properties), globals.css
```

## Partner Integrations

| Partner | Integration | Where in Code |
|---------|------------|---------------|
| **Solflare** | Primary wallet adapter, portfolio view, tx simulation | `src/context/WalletContext.jsx`, `src/components/layout/Header.jsx` |
| **Kamino** | Vault listing, deposit/withdraw via KTX API, position tracking | `src/services/kamino.js`, `src/hooks/useVaults.js`, `src/hooks/usePositions.js` |
| **DFlow** | Swap routing for stablecoin conversion, MEV-resistant execution | `src/services/dflow.js`, `src/hooks/useBridgeQuote.js` |
| **LI.FI** | Cross-chain bridging from EVM chains to Solana | `src/services/lifi.js`, `src/hooks/useBridgeQuote.js` |
| **Jito** | Bundle API for atomic tx composition, MEV protection | `src/services/jito.js`, `src/hooks/useDepositFlow.js` |
| **Quicknode** | RPC backbone, WebSocket subscriptions, priority fee API | `src/services/quicknode.js` |
| **Supabase** | Wallet-based auth, portfolio persistence, real-time subscriptions | `src/lib/supabase.js`, `src/lib/auth-context.jsx` |

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Vite | 6.x | Build tool |
| React | 18.x | UI framework |
| Tailwind CSS | 3.4 | Utility-first styling |
| React Router | 6.x | Client-side routing |
| Supabase | 2.x | Backend (auth, DB, real-time) |
| lucide-react | latest | Icons (20px, 1.5px stroke) |

## Quick Start

```bash
# Clone the repository
git clone https://github.com/your-username/solgate.git
cd solgate

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Start development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

See [.env.example](.env.example) for all required variables:

- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` — Supabase project
- `VITE_QUICKNODE_RPC_URL` / `VITE_QUICKNODE_WSS_URL` — Quicknode Solana RPC
- `VITE_DFLOW_API_KEY` — DFlow swap API (optional for dev)
- `VITE_LIFI_INTEGRATOR` — LI.FI integrator ID
- `VITE_JITO_BLOCK_ENGINE_URL` — Jito block engine
- `VITE_NETWORK` — `devnet` or `mainnet-beta`
- `VITE_USE_MOCK_DATA` — `true` for mock data, `false` for real APIs

## Database Setup

Run the SQL in `supabase/schema.sql` in your Supabase SQL editor to create:
- `user_settings` — wallet preferences
- `positions` — vault position snapshots
- `transactions` — transaction history log

All tables have Row Level Security (RLS) enabled.

## Design System

- **Dark mode only** — `#0A0E1A` primary background
- **CSS custom properties** — all colors in `src/styles/theme.css`, zero hardcoded hex
- **Tailwind tokens** — `sg-*` prefix (e.g., `bg-sg-bg`, `text-sg-accent-green`)
- **Typography** — Inter for all text, JetBrains Mono for addresses/hashes
- **Icons** — lucide-react, 20px default, 1.5px stroke
- **Cards** — 12px border radius, `rounded-card`

## License

MIT
