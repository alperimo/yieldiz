import React from 'react';

// Inline SVG brand marks for the infrastructure SolGate runs on.
// Each mark is a single-colour glyph that inherits currentColor, so it can sit
// on dark or light surfaces with no edits.
//
// The marks are intentionally simplified, recognisable silhouettes — not the
// full registered logos — because the visual job here is "credibility row",
// not legal lockup. Replace with vendor-supplied SVGs when partnerships are
// formal.

const Mark = ({ children, viewBox = '0 0 64 64' }) => (
  <svg viewBox={viewBox} fill="currentColor" aria-hidden focusable="false">
    {children}
  </svg>
);

const Solflare = () => (
  <Mark>
    <path d="M32 6 L52 22 L40 32 L52 42 L32 58 L12 42 L24 32 L12 22 Z" />
  </Mark>
);

const Lifi = () => (
  <Mark>
    <circle cx="22" cy="32" r="10" />
    <circle cx="44" cy="22" r="6" />
    <circle cx="44" cy="42" r="6" />
    <path d="M22 32 L44 22 M22 32 L44 42" stroke="currentColor" strokeWidth="3" fill="none" />
  </Mark>
);

const Dflow = () => (
  <Mark>
    <path d="M10 18 Q32 4 54 18 Q40 32 54 46 Q32 60 10 46 Q24 32 10 18 Z" />
  </Mark>
);

const Kamino = () => (
  <Mark>
    <path d="M14 14 L32 32 L14 50 Z" />
    <path d="M50 14 L32 32 L50 50 Z" opacity="0.55" />
  </Mark>
);

const Jito = () => (
  <Mark>
    <rect x="12" y="12" width="40" height="40" rx="10" />
    <rect x="22" y="22" width="20" height="20" rx="4" fill="#08111F" />
  </Mark>
);

const QuickNode = () => (
  <Mark>
    <circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" strokeWidth="6" />
    <path d="M44 44 L56 56" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
  </Mark>
);

const MARKS = {
  solflare: Solflare,
  'li.fi': Lifi,
  lifi: Lifi,
  dflow: Dflow,
  kamino: Kamino,
  jito: Jito,
  quicknode: QuickNode,
};

export const BrandMark = ({ name, size = 28, className = '' }) => {
  const key = String(name || '').toLowerCase().trim();
  const Component = MARKS[key];
  if (!Component) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-md text-[10px] font-bold tracking-[0.18em] ${className}`}
        style={{ width: size, height: size }}
      >
        {String(name).slice(0, 2).toUpperCase()}
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <Component />
    </span>
  );
};
