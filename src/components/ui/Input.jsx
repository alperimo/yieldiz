import React from 'react';

export const Input = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label className="text-caption text-sg-text-secondary">{label}</label>
      ) : null}
      <input
        className={`
          w-full bg-sg-bg-elevated border border-sg-border rounded-input
          px-4 py-3 text-body text-sg-text placeholder:text-sg-text-tertiary
          transition-colors duration-150
          focus:outline-none focus:border-sg-accent-purple
          ${error ? 'border-sg-error' : ''}
          ${className}
        `}
        {...props}
      />
      {error ? (
        <span className="text-caption text-sg-error">{error}</span>
      ) : null}
    </div>
  );
};
