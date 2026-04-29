import React from 'react';

const variants = {
  primary: 'bg-[#7E4D22] text-[#F8E6B6] font-semibold shadow-[0_20px_50px_rgba(126,77,34,0.12)] hover:-translate-y-0.5',
  secondary: 'bg-white/80 text-sg-text border border-black/[0.08] hover:border-sg-accent-purple/[0.35] shadow-[0_16px_35px_rgba(126,77,34,0.06)]',
  ghost: 'bg-transparent text-sg-text-secondary hover:text-sg-text hover:bg-white/70',
  danger: 'bg-sg-error/10 text-sg-error border border-sg-error/20 hover:bg-sg-error/20',
};

const sizes = {
  sm: 'px-3.5 py-2 text-caption',
  md: 'px-5 py-3 text-body',
  lg: 'px-7 py-4 text-body font-semibold',
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
