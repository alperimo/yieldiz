import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const formatValue = (value, format, decimals) => {
  if (value == null || Number.isNaN(value)) return '0';
  if (format === 'currency') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: decimals ?? 2,
      maximumFractionDigits: decimals ?? 2,
    }).format(value);
  }
  if (format === 'currency-compact') {
    const rounded = Math.round(value);
    if (rounded >= 1_000_000)
      return `$${(rounded / 1_000_000).toFixed(2)}M`;
    if (rounded >= 1_000)
      return `$${(rounded / 1_000).toFixed(1)}K`;
    return `$${rounded}`;
  }
  if (format === 'percent') {
    return `${value.toFixed(decimals ?? 2)}%`;
  }
  if (format === 'decimal') {
    return value.toFixed(decimals ?? 2);
  }
  return Math.round(value).toLocaleString();
};

export const AnimatedMetric = ({
  value = 0,
  format = 'integer',
  decimals,
  duration = 2.1,
  ease = 'power3.out',
  className = '',
  reducedMotion = false,
  prefix = '',
  suffix = '',
}) => {
  const ref = useRef(null);
  const [display, setDisplay] = useState(
    reducedMotion ? formatValue(value, format, decimals) : formatValue(0, format, decimals)
  );

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(formatValue(value, format, decimals));
      return undefined;
    }
    if (!ref.current) return undefined;
    const obj = { v: 0 };
    const anim = gsap.to(obj, {
      v: value,
      duration,
      ease,
      scrollTrigger: { trigger: ref.current, start: 'top 88%' },
      onUpdate: () => setDisplay(formatValue(obj.v, format, decimals)),
    });
    return () => anim.kill();
  }, [value, format, decimals, duration, ease, reducedMotion]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
};
