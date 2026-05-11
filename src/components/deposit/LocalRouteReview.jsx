import React from 'react';
import { Cpu, ShieldCheck } from 'lucide-react';

export const LocalRouteReview = ({ review, loading, error, onReview, disabled }) => (
  <div className="rounded-[24px] border border-black/[0.06] bg-[#F8E6B6]/30 p-4 shadow-[0_16px_35px_rgba(126,77,34,0.04)]">
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-sg-text">Local route check</p>
          {review?.source || review?.mode ? (
            <span className="rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-medium text-sg-text-tertiary">
              {review.source === 'qvac'
                ? 'QVAC local model'
                : review.source === 'qvac-fallback'
                  ? 'QVAC fallback'
                  : 'Browser local'}
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-xs leading-5 text-sg-text-secondary">
          Get a plain-language review on this device before you confirm.
        </p>
      </div>
      <Cpu size={18} className="text-[#7E4D22]" />
    </div>

    {review ? (
      <div className="mt-4 space-y-2 text-xs leading-5 text-sg-text-secondary">
        <p className="rounded-2xl bg-white/70 px-3 py-2"><strong className="text-sg-text">Summary:</strong> {review.summary}</p>
        <p className="rounded-2xl bg-white/70 px-3 py-2"><strong className="text-sg-text">Watch:</strong> {review.mainRisk}</p>
        {review.privacyNote ? (
          <p className="rounded-2xl bg-white/70 px-3 py-2"><strong className="text-sg-text">Boundary:</strong> {review.privacyNote}</p>
        ) : null}
        <p className="flex items-center gap-2 rounded-2xl bg-white/70 px-3 py-2">
          <ShieldCheck size={13} className="text-[#7E4D22]" />
          {review.recommendation}
        </p>
      </div>
    ) : null}

    {error ? <p className="mt-3 text-xs text-sg-text-tertiary">{error}</p> : null}

    <button
      type="button"
      onClick={onReview}
      disabled={disabled || loading}
      className="mt-4 w-full rounded-full bg-[#7E4D22] px-3 py-2 text-sm font-semibold text-[#F8E6B6] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? 'Reviewing...' : 'Review route locally'}
    </button>
  </div>
);
