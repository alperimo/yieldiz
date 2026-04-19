import React from 'react';

const badgeVariants = {
  default: 'bg-sg-bg-elevated text-sg-text-secondary border-sg-border',
  success: 'bg-sg-success/10 text-sg-success border-sg-success/20',
  warning: 'bg-sg-warning/10 text-sg-warning border-sg-warning/20',
  error: 'bg-sg-error/10 text-sg-error border-sg-error/20',
  info: 'bg-sg-accent-blue/10 text-sg-accent-blue border-sg-accent-blue/20',
  purple: 'bg-sg-accent-purple/10 text-sg-accent-purple border-sg-accent-purple/20',
  green: 'bg-sg-accent-green/10 text-sg-accent-green border-sg-accent-green/20',
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
        inline-flex items-center gap-1 px-2 py-0.5 rounded-full
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
