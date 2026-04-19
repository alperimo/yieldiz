import React from 'react';
import { TOKEN_BADGE_COLORS } from '../../lib/constants';

export const TokenBadge = ({ symbol, name, size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
  };

  const colorClass = TOKEN_BADGE_COLORS[symbol] || 'bg-sg-bg-elevated text-sg-text-secondary';

  return (
    <div
      className={`
        ${sizes[size]} ${colorClass}
        rounded-full flex items-center justify-center font-semibold shrink-0
        ${className}
      `}
      title={name || symbol}
    >
      {symbol?.slice(0, 2)}
    </div>
  );
};

export const PriceDisplay = ({
  amount,
  currency = 'USD',
  size = 'md',
  change,
  className = '',
}) => {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);

  const sizeClasses = {
    sm: 'text-money-sm',
    md: 'text-money',
    lg: 'text-display',
  };

  return (
    <div className={`flex items-baseline gap-2 ${className}`}>
      <span className={`${sizeClasses[size]} text-sg-text`}>{formatted}</span>
      {change != null ? (
        <span className={`text-caption font-medium ${change >= 0 ? 'text-sg-success' : 'text-sg-error'}`}>
          {change >= 0 ? '+' : ''}{change.toFixed(2)}%
        </span>
      ) : null}
    </div>
  );
};

export const DataTable = ({ columns, data, onRowClick, emptyMessage, loading }) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton-shimmer h-14 rounded-lg" />
        ))}
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="text-center py-8 text-sg-text-tertiary text-body">
        {emptyMessage || STRINGS.STATE_NO_DATA}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-sg-border">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`py-3 px-4 text-left text-caption text-sg-text-tertiary font-medium ${col.className || ''}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr
              key={row.id || rowIdx}
              className={`
                border-b border-sg-border/50 last:border-0
                ${onRowClick ? 'cursor-pointer hover:bg-sg-bg-elevated/50 transition-colors' : ''}
              `}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col) => (
                <td key={col.key} className={`py-3 px-4 text-body ${col.cellClassName || ''}`}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
