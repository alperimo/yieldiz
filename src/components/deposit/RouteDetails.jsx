import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Shield, Clock } from 'lucide-react';
import { STRINGS, DEFAULT_SLIPPAGE_DISPLAY } from '../../lib/constants';
import { formatCurrency, formatDuration } from '../../lib/formatters';
import { Badge } from '../ui/Badge';

export const RouteDetails = ({ quote, className = '' }) => {
  const [expanded, setExpanded] = useState(false);

  if (!quote) return null;

  const totalFee = quote.bridgeFee + quote.networkFee;
  const totalTime = quote.steps.reduce((sum, s) => sum + s.estimatedTime, 0);

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-body text-sg-text-secondary hover:text-sg-text transition-colors w-full"
      >
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        <span>{STRINGS.DEPOSIT_ROUTE_DETAILS}</span>
        <span className="ml-auto text-caption text-sg-text-tertiary">
          {quote.steps.length} steps • {formatDuration(totalTime)}
        </span>
      </button>

      {expanded ? (
        <div className="mt-3 space-y-3 rounded-[24px] border border-black/[0.06] bg-white/[0.88] p-4 shadow-[0_16px_35px_rgba(8,17,31,0.04)]">
          {quote.steps.map((step, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-black/[0.08] bg-white text-caption text-sg-text-tertiary">
                {idx + 1}
              </div>
              <div className="flex-1">
                <p className="text-body text-sg-text">{step.description}</p>
                {step.protocol ? (
                  <p className="text-caption text-sg-text-tertiary">{step.protocol}</p>
                ) : null}
              </div>
              <span className="text-caption text-sg-text-tertiary shrink-0">
                {formatDuration(step.estimatedTime)}
              </span>
            </div>
          ))}

          <div className="border-t border-sg-border pt-3 space-y-2">
            <div className="flex justify-between text-caption">
              <span className="text-sg-text-secondary">{STRINGS.DEPOSIT_NETWORK_FEE}</span>
              <span className="text-sg-text">{formatCurrency(quote.networkFee)}</span>
            </div>
            <div className="flex justify-between text-caption">
              <span className="text-sg-text-secondary">{STRINGS.DEPOSIT_BRIDGE_FEE}</span>
              <span className="text-sg-text">{formatCurrency(quote.bridgeFee)}</span>
            </div>
            <div className="flex justify-between text-caption">
              <span className="text-sg-text-secondary">{STRINGS.DEPOSIT_SLIPPAGE}</span>
              <span className="text-sg-text">{DEFAULT_SLIPPAGE_DISPLAY}</span>
            </div>
            <div className="flex justify-between text-caption font-medium">
              <span className="text-sg-text-secondary">{STRINGS.DEPOSIT_TOTAL_TIME}</span>
              <span className="text-sg-text">{formatDuration(totalTime)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="green">
              <Shield size={12} />
              {STRINGS.DEPOSIT_MEV_PROTECTED}
            </Badge>
            <Badge variant="info">
              <Clock size={12} />
              {quote.route} via LI.FI
            </Badge>
          </div>
        </div>
      ) : null}
    </div>
  );
};
