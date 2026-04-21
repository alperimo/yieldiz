import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

const COINS = [
  { label: 'ETH', top: '8%', angle: 12, duration: 26 },
  { label: 'ARB', top: '18%', angle: 98, duration: 22 },
  { label: 'BASE', top: '11%', angle: 168, duration: 30 },
  { label: 'POL', top: '14%', angle: 232, duration: 20 },
  { label: 'OP', top: '20%', angle: 304, duration: 28 },
  { label: 'SOL', top: '6%', angle: 350, duration: 18 },
];

export const AnimatedGlobe = ({ reducedMotion = false }) => {
  const rootRef = useRef(null);
  const globeRef = useRef(null);
  const glowRef = useRef(null);
  const orbitRefs = useRef([]);
  const ribbonRefs = useRef([]);

  useLayoutEffect(() => {
    if (reducedMotion || !rootRef.current) return undefined;

    const ctx = gsap.context(() => {
      gsap.to(globeRef.current, {
        rotate: 360,
        duration: 58,
        ease: 'none',
        repeat: -1,
        transformOrigin: '50% 50%',
      });

      gsap.to(glowRef.current, {
        scale: 1.08,
        opacity: 0.9,
        duration: 4.8,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });

      orbitRefs.current.forEach((orbit, index) => {
        if (!orbit) return;

        gsap.to(orbit, {
          rotate: 360,
          duration: COINS[index].duration,
          ease: 'none',
          repeat: -1,
          transformOrigin: '50% 50%',
        });

        gsap.to(orbit.querySelector('[data-coin]'), {
          y: index % 2 === 0 ? -10 : 10,
          duration: 2.6 + index * 0.18,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      });

      ribbonRefs.current.forEach((ribbon, index) => {
        if (!ribbon) return;

        gsap.to(ribbon, {
          xPercent: index % 2 === 0 ? 3 : -3,
          yPercent: index % 2 === 0 ? -4 : 5,
          duration: 4.5 + index,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div ref={rootRef} className="relative aspect-square w-full max-w-[760px]">
      <div
        ref={glowRef}
        className="absolute inset-[10%] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(20,241,149,0.4),rgba(0,194,255,0.18)_42%,rgba(124,107,255,0.14)_68%,rgba(124,107,255,0)_82%)] blur-3xl"
      />

      {COINS.map((coin, index) => (
        <div
          key={coin.label}
          ref={(node) => {
            orbitRefs.current[index] = node;
          }}
          className="absolute inset-0"
          style={{ transform: `rotate(${coin.angle}deg)` }}
        >
          <div
            data-coin
            className="absolute left-1/2 -translate-x-1/2 rounded-full border border-white/30 bg-white/90 px-3 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-[#08111F] shadow-[0_18px_40px_rgba(8,17,31,0.14)]"
            style={{ top: coin.top }}
          >
            {coin.label}
          </div>
        </div>
      ))}

      <div className="absolute inset-[8%] rounded-full border border-white/20 bg-[radial-gradient(circle_at_50%_40%,rgba(245,247,242,0.9),rgba(194,240,232,0.34)_44%,rgba(8,17,31,0.12)_74%,rgba(8,17,31,0)_100%)] shadow-[0_30px_80px_rgba(8,17,31,0.18)]" />

      <svg
        ref={globeRef}
        viewBox="0 0 640 640"
        className="absolute inset-[8%] h-[84%] w-[84%] translate-x-[9.5%] translate-y-[9.5%]"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="solgateGlobeStroke" x1="0" y1="0" x2="640" y2="640">
            <stop stopColor="#14F195" />
            <stop offset="0.52" stopColor="#00C2FF" />
            <stop offset="1" stopColor="#7C6BFF" />
          </linearGradient>
          <radialGradient id="solgateGlobeFill" cx="0" cy="0" r="1" gradientTransform="translate(250 210) rotate(47) scale(390 420)" gradientUnits="userSpaceOnUse">
            <stop stopColor="rgba(255,255,255,0.96)" />
            <stop offset="0.48" stopColor="rgba(195,248,237,0.92)" />
            <stop offset="1" stopColor="rgba(201,219,255,0.55)" />
          </radialGradient>
        </defs>

        <circle cx="320" cy="320" r="248" fill="url(#solgateGlobeFill)" fillOpacity="0.88" />
        <circle cx="320" cy="320" r="248" stroke="url(#solgateGlobeStroke)" strokeOpacity="0.5" strokeWidth="1.5" />
        <circle cx="320" cy="320" r="212" stroke="url(#solgateGlobeStroke)" strokeOpacity="0.14" />
        <ellipse cx="320" cy="320" rx="248" ry="86" stroke="url(#solgateGlobeStroke)" strokeOpacity="0.3" />
        <ellipse cx="320" cy="320" rx="248" ry="156" stroke="url(#solgateGlobeStroke)" strokeOpacity="0.24" />
        <ellipse cx="320" cy="320" rx="248" ry="208" stroke="url(#solgateGlobeStroke)" strokeOpacity="0.16" />
        <ellipse cx="320" cy="320" rx="88" ry="248" stroke="url(#solgateGlobeStroke)" strokeOpacity="0.24" />
        <ellipse cx="320" cy="320" rx="162" ry="248" stroke="url(#solgateGlobeStroke)" strokeOpacity="0.18" />
        <ellipse cx="320" cy="320" rx="218" ry="248" stroke="url(#solgateGlobeStroke)" strokeOpacity="0.12" />
        <ellipse cx="320" cy="320" rx="248" ry="248" transform="rotate(26 320 320)" stroke="url(#solgateGlobeStroke)" strokeOpacity="0.12" />
        <ellipse cx="320" cy="320" rx="248" ry="248" transform="rotate(-32 320 320)" stroke="url(#solgateGlobeStroke)" strokeOpacity="0.08" />
      </svg>

      <div
        ref={(node) => {
          ribbonRefs.current[0] = node;
        }}
        className="absolute left-[2%] top-[58%] rounded-full border border-white/20 bg-[#08111F]/[0.88] px-4 py-2 text-xs font-medium text-white shadow-[0_24px_60px_rgba(8,17,31,0.26)] backdrop-blur"
      >
        Route visible before execution
      </div>

      <div
        ref={(node) => {
          ribbonRefs.current[1] = node;
        }}
        className="absolute right-[6%] top-[18%] rounded-full border border-white/20 bg-white/90 px-4 py-2 text-xs font-medium text-[#08111F] shadow-[0_24px_60px_rgba(8,17,31,0.12)]"
      >
        Jito-protected Solana entry
      </div>

      <div
        ref={(node) => {
          ribbonRefs.current[2] = node;
        }}
        className="absolute bottom-[7%] right-[14%] rounded-full border border-[#14F195]/30 bg-[#14F195]/[0.12] px-4 py-2 text-xs font-medium text-[#08111F] shadow-[0_24px_60px_rgba(20,241,149,0.16)]"
      >
        Destination: Kamino vaults
      </div>
    </div>
  );
};
