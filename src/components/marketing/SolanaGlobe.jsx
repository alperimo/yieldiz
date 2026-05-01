import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { SUPPORTED_CHAINS } from '../../content/marketing';

// Premium Yieldiz globe.
// Build: clipped SVG wireframe rotating on its own axis, dot-map continents,
// orbiting chain coins, and pulse rings.

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
      gsap.to(sphereRef.current, {
        rotate: 360,
        duration: 84,
        ease: 'none',
        repeat: -1,
        transformOrigin: '50% 50%',
      });

      // Dot-map rotates in sync but slightly offset for depth
      if (dotMapRef.current) {
        gsap.to(dotMapRef.current, {
          rotate: -360,
          duration: 96,
          ease: 'none',
          repeat: -1,
          transformOrigin: '50% 50%',
        });
      }

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
      });
    }, rootRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div
      ref={rootRef}
      className="relative aspect-square w-full max-w-[720px]"
    >
      {/* Ambient halo */}
      <div
        ref={glowRef}
        aria-hidden
        className="absolute inset-[6%] rounded-full bg-[radial-gradient(circle_at_30%_28%,rgba(214,168,79,0.42),rgba(241,210,122,0.24)_44%,rgba(126,77,34,0.14)_68%,rgba(126,77,34,0)_88%)] blur-3xl"
      />

      {/* Outer pulse rings */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          ref={(el) => {
            ringRefs.current[i] = el;
          }}
          aria-hidden
          className="absolute inset-[4%] rounded-full border border-[#D6A84F]/30"
          style={{
            boxShadow:
              '0 0 60px rgba(214,168,79,0.16), inset 0 0 80px rgba(126,77,34,0.08)',
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
            <stop offset="38%" stopColor="rgba(248,230,182,0.48)" />
            <stop offset="72%" stopColor="rgba(214,168,79,0.18)" />
            <stop offset="100%" stopColor="rgba(126,77,34,0.08)" />
          </radialGradient>
          <linearGradient id="sgGrid" x1="-240" y1="-240" x2="240" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F8E6B6" stopOpacity="0.58" />
            <stop offset="50%" stopColor="#D6A84F" stopOpacity="0.48" />
            <stop offset="100%" stopColor="#7E4D22" stopOpacity="0.55" />
          </linearGradient>
          <clipPath id="sgSphereClip">
            <circle cx="0" cy="0" r="238" />
          </clipPath>
        </defs>

        {/* Base sphere fill */}
        <circle cx="0" cy="0" r="240" fill="url(#sgSphere)" />

        <g clipPath="url(#sgSphereClip)">
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
            <g stroke="#D6A84F" fill="none" strokeWidth="1.1" opacity="0.38">
              <ellipse cx="0" cy="0" rx="30" ry="240" />
              <ellipse cx="0" cy="0" rx="120" ry="240" />
              <ellipse cx="0" cy="0" rx="200" ry="240" />
            </g>
            <g stroke="#7E4D22" fill="none" strokeWidth="1.1" opacity="0.18">
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
                fill={d.z > 0.3 ? '#D6A84F' : '#7E4D22'}
                opacity={0.35 + d.z * 0.55}
              />
            ))}
          </g>
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

        {/* Center destination node */}
        <g>
          <circle cx="0" cy="0" r="26" fill="#5C3418" />
          <circle cx="0" cy="0" r="31" fill="none" stroke="#D6A84F" strokeWidth="1.4" opacity="0.78" />
          <text
            x="0"
            y="4"
            textAnchor="middle"
            fontFamily="Sora, Manrope, sans-serif"
            fontSize="9"
            fontWeight="800"
            fill="#F8E6B6"
            letterSpacing="0.08em"
          >
            YLDZ
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
              className="flex items-center gap-2 rounded-full border border-white/50 bg-white/95 px-3 py-1.5 shadow-[0_18px_40px_rgba(126,77,34,0.14)] backdrop-blur"
            >
              <span
                className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-black text-white"
                style={{ background: chain.color }}
              >
                {chain.short.charAt(0)}
              </span>
              <span className="text-[11px] font-semibold tracking-[0.14em] text-[#2A1A0B]">
                {chain.short}
              </span>
            </div>
          </div>
        </div>
      ))}

    </div>
  );
};
