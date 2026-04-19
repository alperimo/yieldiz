import React, { useMemo } from 'react';
import { CheckCircle, Loader, Circle, ExternalLink, Shield } from 'lucide-react';
import { STRINGS, DEPOSIT_FLOW_STATES } from '../../lib/constants';
import { formatCurrency, formatDuration, abbreviateAddress, getExplorerUrl } from '../../lib/formatters';
import { Badge } from '../ui/Badge';

const CONFETTI_COLORS = ['#7C5CFC', '#00D1A0', '#3B82F6', '#F59E0B', '#EF4444', '#10B981'];

const Confetti = () => {
  const particles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 0.5}s`,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      rotation: Math.random() * 360,
    })), []);

  return (
    <div className="absolute inset-x-0 top-0 h-32 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="confetti-particle"
          style={{
            left: p.left,
            animationDelay: p.delay,
            backgroundColor: p.color,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
};

const stepStatusIcon = (stepIdx, currentStep, flowState) => {
  if (flowState === DEPOSIT_FLOW_STATES.CONFIRMED) {
    return <CheckCircle size={20} className="text-sg-success step-complete" />;
  }
  if (stepIdx < currentStep) {
    return <CheckCircle size={20} className="text-sg-success step-complete" />;
  }
  if (stepIdx === currentStep) {
    return <Loader size={20} className="text-sg-accent-purple animate-spin" />;
  }
  return <Circle size={20} className="text-sg-text-tertiary" />;
};

export const TransactionTracker = ({
  flowState,
  currentStep,
  steps,
  txHashes,
  depositInfo,
  onClose,
  onBackToDashboard,
}) => {
  const isComplete = flowState === DEPOSIT_FLOW_STATES.CONFIRMED;
  const isError = flowState === DEPOSIT_FLOW_STATES.ERROR;

  return (
    <div className="relative space-y-6">
      {isComplete && <Confetti />}

      {/* Progress bar */}
      <div className="flex items-center gap-1">
        {steps.map((step, idx) => (
          <React.Fragment key={step.key}>
            <div className="flex items-center gap-2">
              {stepStatusIcon(idx, currentStep, flowState)}
              <span className={`text-caption ${
                idx <= currentStep ? 'text-sg-text' : 'text-sg-text-tertiary'
              }`}>
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 ? (
              <div className={`flex-1 h-0.5 mx-2 rounded ${
                idx < currentStep ? 'bg-sg-success' : 'bg-sg-border'
              }`} />
            ) : null}
          </React.Fragment>
        ))}
        {/* Done indicator */}
        <div className="flex-1 h-0.5 mx-2 rounded bg-sg-border" />
        <div className="flex items-center gap-2">
          {isComplete ? (
            <CheckCircle size={20} className="text-sg-success" />
          ) : (
            <Circle size={20} className="text-sg-text-tertiary" />
          )}
          <span className={`text-caption ${isComplete ? 'text-sg-text' : 'text-sg-text-tertiary'}`}>
            {STRINGS.TX_STEP_DONE}
          </span>
        </div>
      </div>

      {/* Step details */}
      <div className="space-y-3">
        {steps.map((step, idx) => {
          const hash = txHashes[step.key];
          const isCompleted = idx < currentStep || isComplete;
          const isActive = idx === currentStep && !isComplete;
          const chain = step.key === 'bridge' ? (depositInfo?.fromChain || 'ethereum') : 'solana';

          return (
            <div
              key={step.key}
              className={`p-4 rounded-xl border ${
                isActive ? 'bg-sg-bg-elevated border-sg-accent-purple/30' :
                isCompleted ? 'bg-sg-bg-elevated/50 border-sg-border' :
                'border-sg-border/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {stepStatusIcon(idx, currentStep, flowState)}
                  <span className="text-body text-sg-text">
                    {depositInfo?.steps?.[idx]?.description || `Step ${idx + 1}: ${step.label}`}
                  </span>
                </div>
                {isCompleted && depositInfo?.steps?.[idx]?.estimatedTime ? (
                  <span className="text-caption text-sg-text-tertiary">
                    {formatDuration(depositInfo.steps[idx].estimatedTime)}
                  </span>
                ) : null}
              </div>
              {hash ? (
                <div className="mt-2 flex items-center gap-2 text-caption">
                  <span className="text-sg-text-tertiary">Tx:</span>
                  <a
                    href={getExplorerUrl(chain, hash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-sg-accent-purple hover:underline flex items-center gap-1"
                  >
                    {abbreviateAddress(hash, 6)}
                    <ExternalLink size={12} />
                  </a>
                </div>
              ) : null}
              {step.key === 'deposit' && (isActive || isCompleted) ? (
                <div className="mt-2">
                  <Badge variant="green">
                    <Shield size={12} />
                    {STRINGS.DEPOSIT_MEV_PROTECTED}
                  </Badge>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Summary (shown when complete) */}
      {isComplete && depositInfo ? (
        <div className="border-t border-sg-border pt-4 space-y-2">
          <h3 className="text-h3 text-sg-text">{STRINGS.TX_SUMMARY}</h3>
          <div className="flex justify-between text-body">
            <span className="text-sg-text-secondary">{STRINGS.TX_DEPOSITED}</span>
            <span className="text-sg-text font-medium">
              {formatCurrency(depositInfo.amount)} {depositInfo.token}
            </span>
          </div>
          <div className="flex justify-between text-body">
            <span className="text-sg-text-secondary">{STRINGS.TX_FEES}</span>
            <span className="text-sg-text">
              {formatCurrency(depositInfo.totalFees)}
            </span>
          </div>
          <div className="flex justify-between text-body">
            <span className="text-sg-text-secondary">{STRINGS.TX_ESTIMATED_ANNUAL}</span>
            <span className="text-sg-accent-green font-medium">
              ~{formatCurrency(depositInfo.amount * (depositInfo.apy / 100))} at {depositInfo.apy}% APY
            </span>
          </div>
        </div>
      ) : null}

      {isError ? (
        <div className="p-4 rounded-xl bg-sg-error/10 border border-sg-error/20">
          <p className="text-body text-sg-error">{STRINGS.STATE_ERROR}</p>
        </div>
      ) : null}
    </div>
  );
};
