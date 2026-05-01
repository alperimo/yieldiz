import React from 'react';

/**
 * Yieldiz brand mark.
 *
 * Visual idea: a premium yield coin with a clean Y monogram and north star.
 * The mark stays readable at favicon size and scales cleanly in the app header.
 */
export const YieldizLogo = ({
  size = 32,
  monochrome = false,
  title = 'Yieldiz',
  className = '',
  ...rest
}) => {
  const coinFill = monochrome ? 'none' : '#FFF4CF';
  const ring = monochrome ? 'currentColor' : '#D6A84F';
  const deep = monochrome ? 'currentColor' : '#7E4D22';
  const star = monochrome ? 'currentColor' : '#F1D27A';

  return (
    <svg
      role="img"
      aria-label={title}
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      {...rest}
    >
      <circle cx="24" cy="24" r="20.5" fill={coinFill} stroke={ring} strokeWidth="2.5" />
      <circle cx="24" cy="24" r="15.5" fill="none" stroke={ring} strokeWidth="1.1" opacity="0.38" />
      <path
        d="M17.2 18.4 24 25.6l6.8-7.2M24 25.6v9.2"
        fill="none"
        stroke={deep}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M24 9.8l1.75 4.1 4.45.38-3.38 2.92 1 4.36L24 19.24l-3.82 2.32 1-4.36-3.38-2.92 4.45-.38L24 9.8z" fill={star} />
    </svg>
  );
};

export default YieldizLogo;
