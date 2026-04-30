import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { STABLECOIN_OPTIONS } from '../../lib/stablecoins';
import { TokenBadge } from '../ui/DataDisplay';

export const StablecoinSelector = ({ value, onChange, className = '' }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = STABLECOIN_OPTIONS.find((token) => token.symbol === value) || STABLECOIN_OPTIONS[0];

  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((next) => !next)}
        className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-3 py-2 text-sm font-medium text-sg-text shadow-[0_14px_30px_rgba(126,77,34,0.04)]"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <TokenBadge symbol={selected.symbol} size="sm" />
        {selected.symbol}
        <ChevronDown size={15} className={`text-sg-text-tertiary transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open ? (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-50 mt-2 min-w-[230px] rounded-[20px] border border-black/[0.08] bg-white/[0.98] p-1 shadow-[0_24px_60px_rgba(126,77,34,0.12)]"
        >
          {STABLECOIN_OPTIONS.map((token) => (
            <li key={token.symbol}>
              <button
                type="button"
                role="option"
                aria-selected={token.symbol === value}
                onClick={() => {
                  onChange(token.symbol);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors ${
                  token.symbol === value ? 'bg-[#F8E6B6]/50 text-[#2A1A0B]' : 'hover:bg-black/[0.03]'
                }`}
              >
                <TokenBadge symbol={token.symbol} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">{token.symbol}</span>
                  <span className="block truncate text-xs text-sg-text-tertiary">{token.category}</span>
                </span>
                {token.symbol === value ? <Check size={14} /> : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

