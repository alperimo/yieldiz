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
  const stroke = monochrome ? 'currentColor' : '#D6A84F';
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
