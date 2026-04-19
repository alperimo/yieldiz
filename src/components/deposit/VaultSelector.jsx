import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, TrendingUp } from 'lucide-react';
import { TokenBadge } from '../ui/DataDisplay';
import { STRINGS } from '../../lib/constants';
import { formatPercent } from '../../lib/formatters';

export const VaultSelector = ({ vaults, value, onChange, className = '' }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = vaults?.find((v) => v.pubkey === value);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    if (open) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        className="flex items-center gap-2 bg-sg-bg-elevated border border-sg-border rounded-input px-3 py-2 text-body text-sg-text hover:border-sg-accent-purple/50 transition-colors w-full justify-between"
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate">
          {selected ? selected.name : STRINGS.DEPOSIT_SELECT_VAULT}
        </span>
        <ChevronDown size={16} className={`text-sg-text-tertiary shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && vaults?.length > 0 && (
        <ul
          role="listbox"
          className="absolute left-0 top-full mt-1 z-50 w-full min-w-[260px] bg-sg-bg-elevated border border-sg-border rounded-card py-1 shadow-lg shadow-black/30 max-h-[240px] overflow-y-auto animate-in"
        >
          {vaults.map((vault) => (
            <li key={vault.pubkey}>
              <button
                type="button"
                role="option"
                aria-selected={vault.pubkey === value}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-body transition-colors ${
                  vault.pubkey === value
                    ? 'bg-sg-accent-purple/10 text-sg-accent-purple'
                    : 'text-sg-text hover:bg-sg-bg-secondary'
                }`}
                onClick={() => { onChange(vault.pubkey); setOpen(false); }}
              >
                <TokenBadge symbol={vault.token} size="sm" />
                <div className="flex-1 text-left min-w-0">
                  <p className="truncate text-body">{vault.name}</p>
                  <p className="text-caption text-sg-text-tertiary">{vault.token}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <TrendingUp size={12} className="text-sg-accent-green" />
                  <span className="text-caption text-sg-accent-green">{formatPercent(vault.apy)}</span>
                </div>
                {vault.pubkey === value && <Check size={14} className="shrink-0" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
