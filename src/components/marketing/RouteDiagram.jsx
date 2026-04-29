import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SUPPORTED_CHAINS } from '../../content/marketing';

gsap.registerPlugin(ScrollTrigger);

// Large SVG route diagram with scroll-linked "signal flow" animation.
// Source chains on the left, Solana destination on the right, signals travel
// the bezier paths via animated dash offsets (no extra plugins needed).

const SOURCES = SUPPORTED_CHAINS.filter((c) => c.id !== 'solana');

const pathFor = (sourceY) => {
  const startX = 130;
  const endX = 370;
  const endY = 280;
  return `M ${startX} ${sourceY} C ${220} ${sourceY}, ${280} ${endY}, ${endX} ${endY}`;
};

export const RouteDiagram = ({ reducedMotion = false }) => {
  const rootRef = useRef(null);
  const drawRefs = useRef([]);
  const flowRefs = useRef([]);

  useLayoutEffect(() => {
    if (reducedMotion || !rootRef.current) return undefined;
    const ctx = gsap.context(() => {
      drawRefs.current.forEach((path, i) => {
        if (!path) return;
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 1.4,
          delay: i * 0.16,
          ease: 'power2.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 78%' },
        });
      });

      flowRefs.current.forEach((path, i) => {
        if (!path) return;
        gsap.set(path, { strokeDasharray: '4 14', strokeDashoffset: 0 });
        gsap.to(path, {
          strokeDashoffset: -180,
          duration: 2.4 + i * 0.12,
          ease: 'none',
          repeat: -1,
          scrollTrigger: { trigger: rootRef.current, start: 'top 78%' },
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div ref={rootRef} className="relative">
      <svg viewBox="0 0 840 560" className="w-full" aria-hidden="true">
        <defs>
          <filter id="rdGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>

        {/* Column labels */}
        <text x="130" y="44" fill="#7E4D22" opacity="0.68" fontFamily="Manrope, sans-serif" fontSize="10" letterSpacing="3" fontWeight="700">
          SOURCE CHAINS
        </text>
        <text x="420" y="44" fill="#7E4D22" opacity="0.68" fontFamily="Manrope, sans-serif" fontSize="10" letterSpacing="3" fontWeight="700">
          ROUTING LAYER
        </text>
        <text x="700" y="44" fill="#7E4D22" opacity="0.68" fontFamily="Manrope, sans-serif" fontSize="10" letterSpacing="3" fontWeight="700">
          DESTINATION
        </text>

        {/* Routing layer cards */}
        <g>
          <rect x="410" y="150" width="180" height="58" rx="14" fill="#FFF7DE" stroke="rgba(126,77,34,0.18)" />
          <text x="500" y="178" textAnchor="middle" fill="#2A1A0B" fontFamily="Manrope, sans-serif" fontSize="12" fontWeight="700" letterSpacing="2">LI.FI</text>
          <text x="500" y="196" textAnchor="middle" fill="#7E4D22" opacity="0.72" fontFamily="Manrope, sans-serif" fontSize="10" letterSpacing="1.5">BRIDGE · OPTIMAL ROUTE</text>

          <rect x="410" y="228" width="180" height="58" rx="14" fill="#FFF7DE" stroke="rgba(126,77,34,0.18)" />
          <text x="500" y="256" textAnchor="middle" fill="#2A1A0B" fontFamily="Manrope, sans-serif" fontSize="12" fontWeight="700" letterSpacing="2">DFLOW</text>
          <text x="500" y="274" textAnchor="middle" fill="#7E4D22" opacity="0.72" fontFamily="Manrope, sans-serif" fontSize="10" letterSpacing="1.5">FINAL-LEG SWAP</text>

          <rect x="410" y="306" width="180" height="58" rx="14" fill="#FFF7DE" stroke="rgba(126,77,34,0.18)" />
          <text x="500" y="334" textAnchor="middle" fill="#2A1A0B" fontFamily="Manrope, sans-serif" fontSize="12" fontWeight="700" letterSpacing="2">JITO</text>
          <text x="500" y="352" textAnchor="middle" fill="#7E4D22" opacity="0.9" fontFamily="Manrope, sans-serif" fontSize="10" letterSpacing="1.5">MEV-PROTECTED BUNDLE</text>
        </g>

        {/* Sources with paths into routing layer */}
        {SOURCES.map((chain, i) => {
          const y = 100 + i * 78;
          return (
            <g key={chain.id}>
              <rect x="12" y={y - 18} width="118" height="36" rx="18" fill="#FFF7DE" stroke="rgba(126,77,34,0.18)" />
              <circle cx="32" cy={y} r="7" fill={chain.color} />
              <text x="46" y={y + 4} fill="#2A1A0B" fontFamily="Manrope, sans-serif" fontSize="12" fontWeight="700">
                {chain.label}
              </text>

              {/* Base (draw-on) */}
              <path
                ref={(el) => {
                  drawRefs.current[i] = el;
                }}
                d={pathFor(y)}
                fill="none"
                stroke="#7E4D22"
                strokeWidth="1.3"
                strokeLinecap="round"
                opacity="0.7"
              />
              {/* Flow (animated dashes) */}
              <path
                ref={(el) => {
                  flowRefs.current[i] = el;
                }}
                d={pathFor(y)}
                fill="none"
                stroke="#7E4D22"
                strokeWidth="1.8"
                strokeLinecap="round"
                opacity="0.9"
                filter="url(#rdGlow)"
              />
            </g>
          );
        })}

        {/* Destination */}
        <g>
          <circle cx="740" cy="280" r="60" fill="#D6A84F" opacity="0.18" />
          <circle cx="740" cy="280" r="32" fill="#7E4D22" stroke="#7E4D22" strokeWidth="1.6" />
          <text x="740" y="274" textAnchor="middle" fill="#F8E6B6" fontFamily="Sora, Manrope, sans-serif" fontSize="11" fontWeight="700" letterSpacing="2">SOLANA</text>
          <text x="740" y="290" textAnchor="middle" fill="#F8E6B6" fontFamily="Manrope, sans-serif" fontSize="9" letterSpacing="1.5">KAMINO VAULT</text>
        </g>

        {/* Routing → destination connectors */}
        <path d="M 590 179 C 640 179, 680 240, 708 268" fill="none" stroke="#7E4D22" strokeWidth="1.3" opacity="0.42" />
        <path d="M 590 257 C 640 257, 680 270, 708 278" fill="none" stroke="#7E4D22" strokeWidth="1.3" opacity="0.62" />
        <path d="M 590 335 C 640 335, 680 310, 708 290" fill="none" stroke="#7E4D22" strokeWidth="1.3" opacity="0.42" />
      </svg>
    </div>
  );
};
