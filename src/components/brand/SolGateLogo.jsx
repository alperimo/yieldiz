import React from 'react';

/**
 * SolGate brand mark.
 *
 * Visual idea: a stylised "G" shaped like an opening gate / rising sun.
 * – Outer arc reads as the gate left ajar (capital flowing in).
 * – Inner dot reads as the sun ("Sol") on the horizon line.
 * – Geometry stays readable at 16×16 (favicon-safe).
 */
export const SolGateLogo = ({
  size = 32,
  monochrome = false,
  title = 'SolGate',
  className = '',
  ...rest
}) => {
  const gradientId = React.useId();
  const stroke = monochrome ? 'currentColor' : `url(#${gradientId})`;
  return (
    <svg
      role="img"
      aria-label={title}
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      {...rest}
    >
      {!monochrome && (
        <defs>
          <linearGradient id={gradientId} x1="4" y1="6" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F8E6B6" />
            <stop offset="52%" stopColor="#D6A84F" />
            <stop offset="100%" stopColor="#7E4D22" />
          </linearGradient>
        </defs>
      )}
      <path
        d="M22.4 8.6 a10 10 0 1 0 3.0 9.6 H17"
        fill="none"
        stroke={stroke}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="16" r="2.2" fill={stroke} />
    </svg>
  );
};

export default SolGateLogo;
