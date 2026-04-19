import React from 'react';
import { NavLink } from 'react-router-dom';
import { useWallet } from '../../context/WalletContext';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Badge } from '../ui/Badge';
import { STRINGS } from '../../lib/constants';
import { abbreviateAddress } from '../../lib/formatters';
import { LogOut, Menu } from 'lucide-react';

export const Header = ({ onMenuToggle }) => {
  const { connected, address, balance, disconnect } = useWallet();
  const network = import.meta.env.VITE_NETWORK || 'devnet';

  return (
    <header className="sticky top-0 z-40 bg-sg-bg-secondary/80 backdrop-blur-md border-b border-sg-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden text-sg-text-secondary hover:text-sg-text p-1"
            aria-label="Toggle menu"
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>

          <NavLink to="/" className="lg:hidden flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[image:var(--gradient-cta)] flex items-center justify-center text-[#163300] font-bold text-xs">
              SG
            </div>
            <span className="text-h3 text-sg-text">{STRINGS.APP_NAME}</span>
          </NavLink>
        </div>

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
            <WalletMultiButton className="!bg-[image:var(--gradient-cta)] !rounded-button !text-body !font-semibold !h-10 !px-5 !text-[#163300]" />
          )}
        </div>
      </div>
    </header>
  );
};
