import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { CHAINS } from '../../lib/constants';

export const ChainSelector = ({ value, onChange, className = '' }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = CHAINS.find((c) => c.id === value) || CHAINS[0];

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
        className="flex items-center gap-2 rounded-input border border-black/[0.08] bg-white/[0.88] px-3 py-2.5 text-body text-sg-text shadow-[0_14px_30px_rgba(8,17,31,0.04)] transition-colors hover:border-sg-accent-purple/50"
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="text-lg leading-none">{selected.icon}</span>
        <span>{selected.name}</span>
        <ChevronDown size={16} className={`text-sg-text-tertiary transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-50 mt-2 min-w-[180px] rounded-card border border-black/[0.08] bg-white/[0.96] py-1 shadow-[0_24px_60px_rgba(8,17,31,0.12)] animate-in"
        >
          {CHAINS.map((chain) => (
            <li key={chain.id}>
              <button
                type="button"
                role="option"
                aria-selected={chain.id === value}
                className={`w-full flex items-center gap-2 px-3 py-2 text-body transition-colors ${
                  chain.id === value
                    ? 'bg-sg-accent-purple/10 text-sg-accent-purple'
                    : 'text-sg-text hover:bg-sg-bg-elevated'
                }`}
                onClick={() => { onChange(chain.id); setOpen(false); }}
              >
                <span className="text-lg leading-none w-6 text-center">{chain.icon}</span>
                <span className="flex-1 text-left">{chain.name}</span>
                {chain.id === value && <Check size={14} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
