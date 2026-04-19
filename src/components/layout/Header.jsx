import React from 'react';
import { NavLink } from 'react-router-dom';
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

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-sg-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8 max-w-[1400px] mx-auto">
        {/* Left: Logo + mobile menu */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden text-sg-text-secondary hover:text-sg-text p-1"
            aria-label="Toggle menu"
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>

          <NavLink to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[image:var(--gradient-cta)] flex items-center justify-center text-[#163300] font-bold text-sm">
              {STRINGS.APP_LOGO_ABBR}
            </div>
            <span className="text-h3 text-sg-text">{STRINGS.APP_NAME}</span>
          </NavLink>
        </div>

        {/* Center: Navigation links (desktop) */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map(({ to, label, iconName }) => {
            const Icon = ICON_MAP[iconName];
            return (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => `
                  flex items-center gap-2 px-4 py-2 rounded-lg text-body
                  transition-colors duration-150
                  ${isActive
                    ? 'bg-sg-accent-purple/10 text-sg-accent-purple font-medium'
                    : 'text-sg-text-secondary hover:text-sg-text hover:bg-sg-bg-elevated'}
                `}
              >
                <Icon size={18} strokeWidth={1.5} />
                <span>{STRINGS[label]}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Right: Wallet */}
        <div className="flex items-center gap-3">
          {connected ? (
            <div className="flex items-center gap-2">
              <Badge variant="purple">
                <span className="w-1.5 h-1.5 rounded-full bg-sg-success" />
                {network === 'mainnet-beta' ? STRINGS.NETWORK_MAINNET : STRINGS.NETWORK_DEVNET}
              </Badge>
              <div className="flex items-center gap-2 bg-sg-bg-elevated border border-sg-border rounded-button px-3 py-2">
                <span className="text-caption text-sg-text-secondary">
                  {balance != null ? `${Number(balance).toFixed(2)} SOL` : ''}
                </span>
                <span className="text-caption font-mono text-sg-text">
                  {abbreviateAddress(address)}
                </span>
                <button
                  onClick={disconnect}
                  className="text-sg-text-tertiary hover:text-sg-error transition-colors ml-1"
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
