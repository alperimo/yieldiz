import React from 'react';
import { STRINGS } from '../../lib/constants';
import { TokenBadge } from '../ui/DataDisplay';

export const AmountInput = ({
  value,
  onChange,
  token = 'USDC',
  balance,
  onMax,
  label,
  readOnly = false,
  className = '',
}) => {
  return (
    <div className={`rounded-[24px] border border-black/[0.06] bg-[rgba(255,255,255,0.92)] p-4 shadow-[0_16px_35px_rgba(126,77,34,0.04)] ${className}`}>
      {label ? (
        <div className="flex items-center justify-between mb-2">
          <span className="text-caption text-sg-text-secondary">{label}</span>
        </div>
      ) : null}
      <div className="flex items-center gap-3">
        <input
          type="text"
          inputMode="decimal"
          placeholder={STRINGS.DEPOSIT_AMOUNT_PLACEHOLDER}
          value={value}
          onChange={(e) => {
            const val = e.target.value;
            if (/^\d*\.?\d*$/.test(val)) onChange(val);
          }}
          readOnly={readOnly}
          className="flex-1 bg-transparent text-money text-sg-text placeholder:text-sg-text-tertiary outline-none min-w-0"
        />
        <div className="flex items-center gap-2 shrink-0">
          <TokenBadge symbol={token} size="sm" />
          <span className="text-body font-medium text-sg-text">{token}</span>
        </div>
      </div>
      {balance != null ? (
        <div className="flex items-center justify-between mt-2">
          <span className="text-caption text-sg-text-tertiary">
            {STRINGS.DEPOSIT_BALANCE}: {Number(balance).toLocaleString()} {token}
          </span>
          {onMax ? (
            <button
              type="button"
              onClick={onMax}
              className="rounded-full bg-[#7E4D22] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F8E6B6] transition-transform hover:-translate-y-0.5"
            >
              {STRINGS.DEPOSIT_MAX}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
