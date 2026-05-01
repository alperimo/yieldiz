import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useWallet } from '../../context/WalletContext';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Badge } from '../ui/Badge';
import { STRINGS, NAV_ITEMS } from '../../lib/constants';
import { abbreviateAddress } from '../../lib/formatters';
import { LogOut, Menu, ArrowDownToLine, LayoutDashboard, Vault } from 'lucide-react';
import { useHideOnScroll } from '../../hooks/useHideOnScroll';
import { YieldizLogo } from '../brand/YieldizLogo';

const ICON_MAP = { ArrowDownToLine, LayoutDashboard, Vault };

export const Header = ({ onMenuToggle }) => {
  const { connected, address, balance, disconnect } = useWallet();
  const network = import.meta.env.VITE_NETWORK || 'devnet';
  const { hidden, scrolled } = useHideOnScroll();

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-all duration-300 ease-out ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      } ${
        scrolled
          ? 'border-black/[0.06] bg-[rgba(245,247,242,0.92)] backdrop-blur-xl shadow-[0_8px_30px_rgba(126,77,34,0.06)]'
          : 'border-transparent bg-[rgba(245,247,242,0.6)] backdrop-blur-md'
      }`}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex h-[68px] max-w-[1360px] items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="rounded-full border border-black/[0.08] bg-white/60 p-2 text-sg-text-secondary transition-colors hover:text-sg-text lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>

          <NavLink to="/app" className="flex items-center gap-3 text-[#2A1A0B]">
            <YieldizLogo size={32} />
            <div>
              <p className="font-display text-[17px] font-semibold leading-none">{STRINGS.APP_NAME}</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.26em] text-sg-text-secondary">
                Stablecoin yield
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
                  flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-150
                  ${isActive
                    ? 'bg-[#7E4D22] text-[#F8E6B6] shadow-[0_10px_24px_rgba(126,77,34,0.18)]'
                    : 'text-sg-text-secondary hover:text-[#2A1A0B]'}
                `}
              >
                <Icon size={16} strokeWidth={1.6} />
                <span>{STRINGS[label]}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="hidden rounded-full px-3 py-2 text-sm font-medium text-sg-text-secondary transition-colors hover:text-[#2A1A0B] lg:inline-flex"
          >
            About
          </Link>
          {connected ? (
            <div className="flex items-center gap-2">
              <Badge variant="purple" className="hidden sm:inline-flex">
                <span className="w-1.5 h-1.5 rounded-full bg-sg-success" />
                {network === 'mainnet-beta' ? STRINGS.NETWORK_MAINNET : STRINGS.NETWORK_DEVNET}
              </Badge>
              <div className="flex items-center gap-2 rounded-full border border-black/[0.08] bg-white/80 px-3 py-2 shadow-[0_10px_24px_rgba(126,77,34,0.06)]">
                <span className="hidden text-caption text-sg-text-secondary sm:inline">
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
      </div>
    </header>
  );
};
