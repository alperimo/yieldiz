import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useWallet } from '../../context/WalletContext';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Badge } from '../ui/Badge';
import { STRINGS, NAV_ITEMS } from '../../lib/constants';
import { abbreviateAddress } from '../../lib/formatters';
import { LogOut, Menu, ArrowDownToLine, LayoutDashboard, Vault } from 'lucide-react';

const ICON_MAP = { ArrowDownToLine, LayoutDashboard, Vault };

export const Header = ({ onMenuToggle }) => {
  const { connected, address, balance, disconnect } = useWallet();
  const network = import.meta.env.VITE_NETWORK || 'devnet';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-5">
      <div
        className={`mx-auto max-w-[1380px] rounded-[28px] border px-4 py-3 transition-all duration-300 sm:px-6 ${
          scrolled
            ? 'border-white/40 bg-[rgba(245,247,242,0.88)] shadow-[0_24px_90px_rgba(8,17,31,0.12)] backdrop-blur-xl'
            : 'border-transparent bg-transparent'
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuToggle}
              className="rounded-full border border-black/[0.08] bg-white/60 p-2 text-sg-text-secondary transition-colors hover:text-sg-text lg:hidden"
              aria-label="Toggle menu"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>

            <NavLink to="/app" className="flex items-center gap-3 text-[#08111F]">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#08111F] text-sm font-black tracking-[0.18em] text-white shadow-[0_20px_40px_rgba(8,17,31,0.18)]">
                {STRINGS.APP_LOGO_ABBR}
              </div>
              <div>
                <p className="font-display text-lg font-semibold leading-none">{STRINGS.APP_NAME}</p>
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-sg-text-secondary">
                  Stablecoin yield
                </p>
              </div>
            </NavLink>
          </div>

          <nav className="hidden items-center gap-2 lg:flex">
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
                      ? 'bg-[#08111F] text-white shadow-[0_12px_30px_rgba(8,17,31,0.18)]'
                      : 'text-sg-text-secondary hover:bg-white/60 hover:text-[#08111F]'}
                  `}
                >
                  <Icon size={16} strokeWidth={1.6} />
                  <span>{STRINGS[label]}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden rounded-full px-3 py-2 text-sm font-medium text-sg-text-secondary transition-colors hover:text-[#08111F] lg:inline-flex"
            >
              About
            </Link>
            {connected ? (
              <div className="flex items-center gap-2">
                <Badge variant="purple" className="hidden sm:inline-flex">
                  <span className="w-1.5 h-1.5 rounded-full bg-sg-success" />
                  {network === 'mainnet-beta' ? STRINGS.NETWORK_MAINNET : STRINGS.NETWORK_DEVNET}
                </Badge>
                <div className="flex items-center gap-2 rounded-full border border-black/[0.08] bg-white/80 px-3 py-2 shadow-[0_12px_30px_rgba(8,17,31,0.06)]">
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
