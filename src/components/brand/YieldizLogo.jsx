import React from 'react';

export const YieldizLogo = ({
  size = 32,
  monochrome = false,
  title = 'Yieldiz',
  className = '',
  ...rest
}) => {
  const surface = monochrome ? 'none' : '#F8E6B6';
  const mark = monochrome ? 'currentColor' : '#7E4D22';

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
      <circle cx="24" cy="24" r="20.5" fill={surface} stroke={mark} strokeWidth="2.35" />
      <circle cx="24" cy="24" r="15.5" fill="none" stroke={mark} strokeWidth="1.05" opacity="0.24" />
      <path
        d="M16.8 18.7 24 26.2l7.2-7.5M24 26.2v9"
        fill="none"
        stroke={mark}
        strokeWidth="3.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 9.2l1.65 4.08 4.08 1.65-4.08 1.65L24 20.66l-1.65-4.08-4.08-1.65 4.08-1.65L24 9.2z"
        fill={mark}
      />
    </svg>
  );
};

export default YieldizLogo;
