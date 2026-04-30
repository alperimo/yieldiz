import React from 'react';
import { Lock, ShieldCheck } from 'lucide-react';
import { PRIVACY_MODE_OPTIONS, PRIVACY_MODES } from '../../lib/stablecoins';

export const PrivacySelector = ({ value, onChange, boundary, loading, error }) => (
  <div className="rounded-[24px] border border-black/[0.06] bg-white/[0.88] p-4 shadow-[0_16px_35px_rgba(126,77,34,0.04)]">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-semibold text-sg-text">Privacy</p>
        <p className="mt-1 text-xs leading-5 text-sg-text-tertiary">{boundary.description}</p>
      </div>
      {value === PRIVACY_MODES.STANDARD ? (
        <ShieldCheck size={18} className="text-[#7E4D22]" />
      ) : (
        <Lock size={18} className="text-[#7E4D22]" />
      )}
    </div>

    <div className="mt-4 grid gap-2">
      {PRIVACY_MODE_OPTIONS.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
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

    {loading ? <p className="mt-3 text-xs text-sg-text-tertiary">Preparing privacy route...</p> : null}
    {error ? <p className="mt-3 text-xs text-sg-error">{error}</p> : null}
  </div>
);

