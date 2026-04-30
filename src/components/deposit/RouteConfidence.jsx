import React from 'react';
import { AlertTriangle, CheckCircle2, History, ShieldCheck } from 'lucide-react';

export const RouteConfidence = ({ confidence, loading, onCheck, disabled }) => {
  const status = confidence?.status;
  const isReady = status === 'ready';
  const isReview = status === 'review';

  return (
    <div className="rounded-[24px] border border-black/[0.06] bg-white/[0.88] p-4 shadow-[0_16px_35px_rgba(126,77,34,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-sg-text">Route confidence</p>
          <p className="mt-1 text-xs leading-5 text-sg-text-tertiary">
            Check wallet activity and approvals before moving funds.
          </p>
        </div>
        {isReady ? <CheckCircle2 size={18} className="text-sg-success" /> : <ShieldCheck size={18} className="text-[#7E4D22]" />}
      </div>

      {confidence ? (
        <div className="mt-4 grid gap-2 text-xs">
          {confidence.status === 'unavailable' || confidence.status === 'error' ? (
            <p className="rounded-2xl bg-black/[0.03] px-3 py-2 leading-5 text-sg-text-secondary">{confidence.reason}</p>
          ) : (
            <>
              <div className="flex items-center justify-between rounded-2xl bg-black/[0.03] px-3 py-2">
                <span className="inline-flex items-center gap-2 text-sg-text-secondary"><History size={13} /> Recent activity</span>
                <span className="font-semibold text-sg-text">{confidence.recentTransactionCount ?? 0}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-black/[0.03] px-3 py-2">
                <span className="inline-flex items-center gap-2 text-sg-text-secondary"><AlertTriangle size={13} /> Approvals to review</span>
                <span className={`font-semibold ${isReview ? 'text-sg-warning' : 'text-sg-text'}`}>
                  {confidence.highRiskApprovalCount ?? 0}
                </span>
              </div>
            </>
          )}
        </div>
      ) : null}

      <button
        type="button"
        onClick={onCheck}
        disabled={disabled || loading}
        className="mt-4 w-full rounded-full border border-black/[0.08] bg-white px-3 py-2 text-sm font-semibold text-sg-text transition-colors hover:bg-[#F8E6B6]/45 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Checking...' : 'Check route'}
      </button>
    </div>
  );
};
