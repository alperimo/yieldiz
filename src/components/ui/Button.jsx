import React from 'react';

const variants = {
  primary: 'text-white font-semibold',
  secondary: 'bg-sg-bg-elevated text-sg-text border border-sg-border hover:border-sg-accent-purple',
  ghost: 'bg-transparent text-sg-text-secondary hover:text-sg-text hover:bg-sg-bg-elevated',
  danger: 'bg-sg-error/10 text-sg-error border border-sg-error/20 hover:bg-sg-error/20',
};

const sizes = {
  sm: 'px-3 py-1.5 text-caption',
  md: 'px-5 py-2.5 text-body',
  lg: 'px-7 py-3.5 text-body font-semibold',
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const isPrimary = variant === 'primary';

  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 rounded-button
        transition-all duration-150 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-[0.97]
        ${isPrimary ? 'bg-[image:var(--gradient-cta)]' : ''}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  );
};
