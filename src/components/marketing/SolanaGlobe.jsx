import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { SUPPORTED_CHAINS } from '../../content/marketing';

// Premium Solana-branded globe.
// Build: SVG wireframe (latitude/longitude) rotating on Y, dot-map continents,
// Solana gradient glow, orbiting chain coins, converging energy beams, pulse rings.

const GRID_LONG = 10;
const GRID_LAT = 6;
const DOT_GRID_COLS = 28;
const DOT_GRID_ROWS = 14;

// Pseudo continents — binary mask (1 = draw dot). Hand-tuned to suggest landmasses.
const CONTINENT_MASK = [
  '0000000000000000000000000000',
  '0000011110000000000000000000',
  '0001111111100000001111110000',
  '0011111111110011111111111100',
  '0111111111110111111111111110',
  '0011111111111111111111111110',
  '0001111111111111111111111100',
  '0000111111110001111111111000',
  '0000011111110000011111110000',
  '0000001111110000011111100000',
  '0000000111100000001111000000',
  '0000000011000000000110000000',
  '0000000001000000000010000000',
  '0000000000000000000000000000',
];

export const SolanaGlobe = ({ reducedMotion = false }) => {
  const rootRef = useRef(null);
  const sphereRef = useRef(null);
  const dotMapRef = useRef(null);
  const glowRef = useRef(null);
  const ringRefs = useRef([]);
  const orbitRefs = useRef([]);
  const beamRefs = useRef([]);

  // Longitude lines (vertical ellipses at staged rotations)
  const longitudes = useMemo(
    () => Array.from({ length: GRID_LONG }, (_, i) => (i * 180) / GRID_LONG),
    [],
  );

  // Latitude bands (horizontal ellipses)
  const latitudes = useMemo(
    () =>
      Array.from({ length: GRID_LAT }, (_, i) => {
        const lat = (i / GRID_LAT) * Math.PI - Math.PI / 2 + Math.PI / (GRID_LAT * 2);
        return Math.cos(lat); // 0..1 radius scale
      }),
    [],
  );

  // Continent dots (projected)
  const dots = useMemo(() => {
    const result = [];
    for (let r = 0; r < DOT_GRID_ROWS; r++) {
      const row = CONTINENT_MASK[r] || '';
      for (let c = 0; c < DOT_GRID_COLS; c++) {
        if (row[c] !== '1') continue;
        const lat = ((r / (DOT_GRID_ROWS - 1)) * Math.PI) - Math.PI / 2;
        const lon = ((c / (DOT_GRID_COLS - 1)) * Math.PI * 2) - Math.PI;
        // Project to 2D circle (orthographic) — we rotate the group so visible side updates
        const x = Math.cos(lat) * Math.sin(lon) * 240;
        const y = -Math.sin(lat) * 240;
        const z = Math.cos(lat) * Math.cos(lon);
        result.push({ x, y, z, r: 2.4 - (1 - z) * 1.2 });
      }
    }
    return result;
  }, []);

  useLayoutEffect(() => {
    if (reducedMotion || !rootRef.current) return undefined;

    const ctx = gsap.context(() => {
      // Sphere rotates on Y (simulate earth spin)
      gsap.to(sphereRef.current, {
        rotateY: 360,
        duration: 42,
        ease: 'none',
        repeat: -1,
        transformOrigin: '50% 50%',
      });

      // Dot-map rotates in sync but slightly offset for depth
      if (dotMapRef.current) {
        gsap.to(dotMapRef.current, {
          rotateY: 360,
          duration: 42,
          ease: 'none',
          repeat: -1,
          transformOrigin: '50% 50%',
        });
      }

      // Ambient glow breathing
      gsap.to(glowRef.current, {
        scale: 1.06,
        opacity: 0.92,
        duration: 5.4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });

      // Pulse rings expanding outward
      ringRefs.current.forEach((ring, index) => {
        if (!ring) return;
        gsap.fromTo(
          ring,
          { scale: 0.82, opacity: 0.55 },
          {
            scale: 1.4,
            opacity: 0,
            duration: 3.6,
            ease: 'power2.out',
            repeat: -1,
            delay: index * 1.2,
          },
        );
      });

      // Chain orbits — each circles at own speed, coin counter-rotates to stay upright
      orbitRefs.current.forEach((orbit, index) => {
        if (!orbit) return;
        const chain = SUPPORTED_CHAINS[index];
        const dur = 24 + index * 3;
        gsap.to(orbit, {
          rotate: 360,
          duration: dur,
          ease: 'none',
          repeat: -1,
          transformOrigin: '50% 50%',
        });
        const coin = orbit.querySelector('[data-coin]');
        if (coin) {
          gsap.to(coin, {
            rotate: -360,
            duration: dur,
            ease: 'none',
            repeat: -1,
            transformOrigin: '50% 50%',
          });
          gsap.to(coin, {
            y: index % 2 === 0 ? -8 : 8,
            duration: 2.4 + index * 0.12,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          });
        }
        // Energy beam flowing from orbit → center
        const beam = beamRefs.current[index];
        if (beam) {
          gsap.fromTo(
            beam,
            { strokeDashoffset: 160 },
            {
              strokeDashoffset: 0,
              duration: 2.4 + index * 0.18,
              ease: 'power1.inOut',
              repeat: -1,
            },
          );
        }
      });
    }, rootRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div
      ref={rootRef}
      className="relative aspect-square w-full max-w-[720px]"
      style={{ perspective: '1400px' }}
    >
      {/* Ambient halo */}
      <div
        ref={glowRef}
        aria-hidden
        className="absolute inset-[6%] rounded-full bg-[radial-gradient(circle_at_30%_28%,rgba(153,69,255,0.45),rgba(20,241,149,0.28)_44%,rgba(0,194,255,0.16)_68%,rgba(153,69,255,0)_88%)] blur-3xl"
      />

      {/* Outer pulse rings */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          ref={(el) => {
            ringRefs.current[i] = el;
          }}
          aria-hidden
          className="absolute inset-[4%] rounded-full border border-[#9945FF]/30"
          style={{
            boxShadow:
              '0 0 60px rgba(153,69,255,0.16), inset 0 0 80px rgba(20,241,149,0.08)',
          }}
        />
      ))}

      {/* Sphere with wireframe grid + continent dots */}
      <svg
        viewBox="-260 -260 520 520"
        className="absolute inset-[10%] h-[80%] w-[80%]"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="sgSphere" cx="0.32" cy="0.28" r="0.9">
            <stop offset="0%" stopColor="rgba(255,255,255,0.94)" />
            <stop offset="38%" stopColor="rgba(201,186,255,0.42)" />
            <stop offset="72%" stopColor="rgba(153,69,255,0.18)" />
            <stop offset="100%" stopColor="rgba(8,17,31,0.08)" />
          </radialGradient>
          <linearGradient id="sgGrid" x1="-240" y1="-240" x2="240" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#9945FF" stopOpacity="0.55" />
            <stop offset="50%" stopColor="#00C2FF" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#14F195" stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id="sgBeam" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#14F195" stopOpacity="0" />
            <stop offset="50%" stopColor="#14F195" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#9945FF" stopOpacity="0" />
          </linearGradient>
          <filter id="sgSoft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.4" />
          </filter>
        </defs>

        {/* Base sphere fill */}
        <circle cx="0" cy="0" r="240" fill="url(#sgSphere)" />

        {/* Wireframe: longitudes + latitudes (static — atmosphere layer) */}
        <g stroke="url(#sgGrid)" fill="none" strokeWidth="0.8" opacity="0.42">
          {longitudes.map((rot) => (
            <ellipse key={`lon-${rot}`} cx="0" cy="0" rx="240" ry="240" transform={`rotate(${rot})`} />
          ))}
          {longitudes.map((rot) => (
            <ellipse
              key={`lon-b-${rot}`}
              cx="0"
              cy="0"
              rx="60"
              ry="240"
              transform={`rotate(${rot})`}
              opacity="0.6"
            />
          ))}
          {latitudes.map((scale, i) => (
            <ellipse key={`lat-${i}`} cx="0" cy="0" rx="240" ry={240 * scale} opacity="0.55" />
          ))}
        </g>

        {/* Rotating inner sphere group (continent dots + meridians) */}
        <g
          ref={sphereRef}
          style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
        >
          {/* Primary meridian highlights */}
          <g stroke="#9945FF" fill="none" strokeWidth="1.1" opacity="0.38">
            <ellipse cx="0" cy="0" rx="30" ry="240" />
            <ellipse cx="0" cy="0" rx="120" ry="240" />
            <ellipse cx="0" cy="0" rx="200" ry="240" />
          </g>
          <g stroke="#14F195" fill="none" strokeWidth="1.1" opacity="0.28">
            <ellipse cx="0" cy="0" rx="80" ry="240" />
            <ellipse cx="0" cy="0" rx="160" ry="240" />
          </g>
        </g>

        {/* Continent dot map — counter-layer with its own rotation for parallax */}
        <g ref={dotMapRef} style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}>
          {dots.map((d, i) => (
            <circle
              key={`dot-${i}`}
              cx={d.x}
              cy={d.y}
              r={Math.max(0.6, d.r)}
              fill={d.z > 0.3 ? '#9945FF' : '#14F195'}
              opacity={0.35 + d.z * 0.55}
            />
          ))}
        </g>

        {/* Rim highlight */}
        <circle
          cx="0"
          cy="0"
          r="240"
          fill="none"
          stroke="url(#sgGrid)"
          strokeWidth="1.6"
          opacity="0.8"
        />

        {/* Energy beams from edge → center (one per chain) */}
        <g opacity="0.75" filter="url(#sgSoft)">
          {SUPPORTED_CHAINS.map((chain, i) => {
            const rad = (chain.angle * Math.PI) / 180;
            const x2 = Math.cos(rad - Math.PI / 2) * 235;
            const y2 = Math.sin(rad - Math.PI / 2) * 235;
            return (
              <line
                key={`beam-${chain.id}`}
                ref={(el) => {
                  beamRefs.current[i] = el;
                }}
                x1={0}
                y1={0}
                x2={x2}
                y2={y2}
                stroke="url(#sgBeam)"
                strokeWidth="1.4"
                strokeDasharray="10 8"
              />
            );
          })}
        </g>

        {/* Center Solana node */}
        <g>
          <circle cx="0" cy="0" r="24" fill="#08111F" />
          <circle cx="0" cy="0" r="24" fill="url(#sgGrid)" opacity="0.9" />
          <circle cx="0" cy="0" r="30" fill="none" stroke="#14F195" strokeWidth="1.2" opacity="0.7" />
          <text
            x="0"
            y="4"
            textAnchor="middle"
            fontFamily="Sora, Manrope, sans-serif"
            fontSize="10"
            fontWeight="700"
            fill="#08111F"
            letterSpacing="0.12em"
          >
            SOL
          </text>
        </g>
      </svg>

      {/* Orbiting chain coins — outside the sphere for legibility */}
      {SUPPORTED_CHAINS.map((chain, index) => (
        <div
          key={chain.id}
          ref={(el) => {
            orbitRefs.current[index] = el;
          }}
          className="absolute inset-0"
          style={{ transform: `rotate(${chain.angle}deg)` }}
          aria-hidden
        >
          <div
            data-coin
            className="absolute left-1/2 top-[3%] -translate-x-1/2"
            style={{ transform: `rotate(${-chain.angle}deg)` }}
          >
            <div
              className="flex items-center gap-2 rounded-full border border-white/50 bg-white/95 px-3 py-1.5 shadow-[0_18px_40px_rgba(8,17,31,0.14)] backdrop-blur"
            >
              <span
                className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-black text-white"
                style={{ background: chain.color }}
              >
                {chain.short.charAt(0)}
              </span>
              <span className="text-[11px] font-semibold tracking-[0.14em] text-[#08111F]">
                {chain.short}
              </span>
            </div>
          </div>
        </div>
      ))}

      {/* Floating annotation chips — corporate context pills */}
      <div className="absolute left-[-2%] top-[62%] rounded-full border border-white/50 bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#08111F] shadow-[0_20px_50px_rgba(8,17,31,0.12)] backdrop-blur">
        <span className="mr-2 inline-flex h-1.5 w-1.5 rounded-full bg-[#14F195] shadow-[0_0_10px_#14F195]" />
        Route visible before execution
      </div>
      <div className="absolute right-[-4%] top-[14%] rounded-full border border-[#9945FF]/30 bg-[#08111F] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_24px_50px_rgba(8,17,31,0.28)]">
        <span className="mr-2 inline-flex h-1.5 w-1.5 rounded-full bg-[#9945FF] shadow-[0_0_10px_#9945FF]" />
        Jito-protected entry
      </div>
      <div className="absolute bottom-[6%] right-[8%] rounded-full border border-[#14F195]/40 bg-[#14F195]/[0.14] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#08111F] shadow-[0_20px_50px_rgba(20,241,149,0.18)] backdrop-blur">
        Destination · Kamino
      </div>
    </div>
  );
};
