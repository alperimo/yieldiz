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
        className="flex w-full items-center justify-between gap-2 rounded-input border border-black/[0.08] bg-white/[0.88] px-3 py-2.5 text-body text-sg-text shadow-[0_14px_30px_rgba(126,77,34,0.04)] transition-colors hover:border-sg-accent-purple/50"
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
          className="absolute left-0 top-full z-50 mt-2 max-h-[240px] w-full min-w-[260px] overflow-y-auto rounded-card border border-black/[0.08] bg-white/[0.96] py-1 shadow-[0_24px_60px_rgba(126,77,34,0.12)] animate-in"
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
                    : 'text-sg-text hover:bg-sg-bg-elevated'
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
