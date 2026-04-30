import React, { useState } from 'react';
import { ChevronDown, Lock, ShieldCheck } from 'lucide-react';
import { PRIVACY_MODE_OPTIONS, PRIVACY_MODES } from '../../lib/stablecoins';

export const PrivacySelector = ({ value, onChange, boundary, loading, error }) => {
  const [open, setOpen] = useState(false);
  const selected = PRIVACY_MODE_OPTIONS.find((option) => option.id === value) || PRIVACY_MODE_OPTIONS[0];
  const Icon = value === PRIVACY_MODES.STANDARD ? ShieldCheck : Lock;

  return (
    <div className="rounded-[24px] border border-black/[0.06] bg-white/[0.88] p-4 shadow-[0_16px_35px_rgba(126,77,34,0.04)]">
      <button
        type="button"
        onClick={() => setOpen((next) => !next)}
        className="flex w-full items-start justify-between gap-3 text-left"
        aria-expanded={open}
      >
        <div className="min-w-0">
          <p className="text-sm font-semibold text-sg-text">Privacy</p>
          <p className="mt-1 text-xs leading-5 text-sg-text-tertiary">{boundary.description}</p>
          <p className="mt-2 inline-flex rounded-full border border-black/[0.06] bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-[#7E4D22]">
            {selected.title}
          </p>
        </div>
        <span className="flex shrink-0 items-center gap-2 text-[#7E4D22]">
          <Icon size={18} />
          <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>

      {open ? (
        <div className="mt-4 grid gap-2">
          {PRIVACY_MODE_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                onChange(option.id);
                setOpen(false);
              }}
              className={`rounded-[18px] border px-3 py-3 text-left transition-colors ${
                value === option.id
                  ? 'border-[#D6A84F]/60 bg-[#F8E6B6]/45 text-[#2A1A0B]'
                  : 'border-black/[0.06] bg-white/70 text-sg-text-secondary hover:text-sg-text'
              }`}
            >
              <span className="block text-sm font-semibold">{option.title}</span>
              <span className="mt-1 block text-xs leading-5">{option.description}</span>
            </button>
          ))}
        </div>
      ) : null}

      {loading ? <p className="mt-3 text-xs text-sg-text-tertiary">Preparing privacy route...</p> : null}
      {error ? <p className="mt-3 text-xs text-sg-error">{error}</p> : null}
    </div>
  );
};
