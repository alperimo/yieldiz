import React from 'react';

export const Card = ({
  children,
  className = '',
  hover = false,
  ...props
}) => {
  return (
    <div
      className={`
        bg-sg-bg-secondary border border-sg-border rounded-card p-6 shadow-sm
        ${hover ? 'card-hover hover:border-sg-accent-purple/30' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
