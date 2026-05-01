import React from 'react';

/**
 * Yieldiz brand mark.
 *
 * Visual idea: a star as the destination for yield, wrapped by an orbital route.
 * Geometry stays readable at favicon size while matching the warm finance palette.
 */
export const YieldizLogo = ({
  size = 32,
  monochrome = false,
  title = 'Yieldiz',
  className = '',
  ...rest
}) => {
  const stroke = monochrome ? 'currentColor' : '#D6A84F';
  const fill = monochrome ? 'currentColor' : '#F1D27A';
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
      <path d="M16 4.2l3.05 7.2 7.75.68-5.9 5.08 1.76 7.62L16 20.74l-6.66 4.04 1.76-7.62-5.9-5.08 7.75-.68L16 4.2z" fill={fill} />
      <path
        d="M29.2 12.3c1.65 3.4-2.7 7.9-9.6 10.1-7.1 2.3-14.6 1.2-16.8-2.4"
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />
      <circle cx="24.7" cy="10.3" r="1.8" fill={stroke} />
    </svg>
  );
};

export default YieldizLogo;
