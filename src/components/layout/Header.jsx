import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useWallet } from '../../context/WalletContext';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Badge } from '../ui/Badge';
import { STRINGS, NAV_ITEMS } from '../../lib/constants';
import { abbreviateAddress } from '../../lib/formatters';
import { LogOut, Menu, ArrowDownToLine, LayoutDashboard, Vault, ArrowUpRight } from 'lucide-react';

const ICON_MAP = { ArrowDownToLine, LayoutDashboard, Vault };

export const Header = ({ onMenuToggle }) => {
  const { connected, address, balance, disconnect } = useWallet();
  const network = import.meta.env.VITE_NETWORK || 'devnet';

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[rgba(245,247,242,0.82)] backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-4 px-4 lg:px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="rounded-full border border-black/[0.08] p-2 text-sg-text-secondary transition-colors hover:text-sg-text lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>

          <NavLink to="/app" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#08111F] text-sm font-black tracking-[0.18em] text-white shadow-[0_18px_40px_rgba(8,17,31,0.12)]">
              {STRINGS.APP_LOGO_ABBR}
            </div>
            <div>
              <span className="font-display text-[22px] font-semibold leading-none text-sg-text">{STRINGS.APP_NAME}</span>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-sg-text-secondary">
                App terminal
              </p>
            </div>
          </NavLink>
        </div>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map(({ to, label, iconName }) => {
            const Icon = ICON_MAP[iconName];
            return (
              <NavLink
                key={to}
                to={to}
                end={to === '/app'}
                className={({ isActive }) => `
                  flex items-center gap-2 rounded-full px-4 py-2.5 text-sm transition-all duration-150
                  ${isActive
                    ? 'bg-[#08111F] text-white shadow-[0_12px_30px_rgba(8,17,31,0.12)]'
                    : 'text-sg-text-secondary hover:bg-white/70 hover:text-sg-text'}
                `}
              >
                <Icon size={18} strokeWidth={1.5} />
                <span>{STRINGS[label]}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="hidden items-center gap-2 rounded-full border border-black/[0.08] bg-white/70 px-4 py-2.5 text-sm font-medium text-sg-text-secondary transition-colors hover:text-sg-text lg:inline-flex"
          >
            View site
            <ArrowUpRight size={15} />
          </Link>
          {connected ? (
            <div className="flex items-center gap-2">
              <Badge variant="purple">
                <span className="w-1.5 h-1.5 rounded-full bg-sg-success" />
                {network === 'mainnet-beta' ? STRINGS.NETWORK_MAINNET : STRINGS.NETWORK_DEVNET}
              </Badge>
              <div className="flex items-center gap-2 rounded-full border border-black/[0.08] bg-white/80 px-3 py-2 shadow-[0_12px_30px_rgba(8,17,31,0.06)]">
                <span className="text-caption text-sg-text-secondary">
                  {balance != null ? `${Number(balance).toFixed(2)} SOL` : ''}
                </span>
                <span className="text-caption font-mono text-sg-text">
                  {abbreviateAddress(address)}
                </span>
                <button
                  onClick={disconnect}
                  className="ml-1 text-sg-text-tertiary transition-colors hover:text-sg-error"
                  aria-label={STRINGS.DISCONNECT}
                >
                  <LogOut size={14} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          ) : (
            <WalletMultiButton className="sg-wallet-btn" />
          )}
        </div>
      </div>
    </header>
  );
};
