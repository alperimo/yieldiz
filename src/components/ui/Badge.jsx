import React from 'react';

const badgeVariants = {
  default: 'bg-white/80 text-sg-text-secondary border-black/[0.08]',
  success: 'bg-sg-success/[0.12] text-sg-success border-sg-success/20',
  warning: 'bg-sg-warning/[0.12] text-sg-warning border-sg-warning/20',
  error: 'bg-sg-error/[0.12] text-sg-error border-sg-error/20',
  info: 'bg-sg-accent-blue/[0.12] text-sg-accent-blue border-sg-accent-blue/20',
  purple: 'bg-sg-accent-purple/[0.12] text-sg-accent-purple border-sg-accent-purple/20',
  green: 'bg-sg-accent-green/[0.12] text-sg-accent-green border-sg-accent-green/20',
};

export const Badge = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full px-2.5 py-1
        text-caption border
        ${badgeVariants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
};
