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
        rounded-card border border-black/[0.08] bg-white/[0.82] p-6 shadow-[0_24px_60px_rgba(126,77,34,0.06)] backdrop-blur
        ${hover ? 'card-hover hover:border-sg-accent-purple/30' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
