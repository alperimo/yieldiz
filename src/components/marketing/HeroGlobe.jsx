import React, { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { SolanaGlobe } from './SolanaGlobe';

const HERO_GLOBE_SRC = '/marketing/hero-globe-master.png';

const PARTICLES = [
  ['12%', '20%', 0.75, 0],
  ['82%', '18%', 0.58, 0.4],
  ['9%', '68%', 0.5, 0.9],
  ['78%', '76%', 0.66, 1.2],
  ['50%', '8%', 0.46, 1.6],
  ['47%', '88%', 0.38, 2],
];

export const HeroGlobe = ({ reducedMotion = false }) => {
  const sceneRef = useRef(null);
  const floatRef = useRef(null);
  const shellRef = useRef(null);
  const imageRef = useRef(null);
  const glowRef = useRef(null);
  const sheenRef = useRef(null);
  const ringRefs = useRef([]);
  const particleRefs = useRef([]);
  const [imageReady, setImageReady] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  useLayoutEffect(() => {
    if (reducedMotion || imageFailed || !imageReady || !floatRef.current || !shellRef.current) return undefined;

    const cleanup = [];
    const ctx = gsap.context(() => {
      gsap.set(shellRef.current, {
        transformPerspective: 1400,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      });

      gsap.to(floatRef.current, {
        y: -22,
        scale: 1.04,
        rotationZ: -1.45,
        duration: 5.8,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        transformOrigin: '50% 50%',
      });

      if (imageRef.current) {
        gsap.to(imageRef.current, {
          filter: 'drop-shadow(0 54px 110px rgba(126,77,34,0.26)) brightness(1.05)',
          duration: 5.8,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      }

      if (glowRef.current) {
        gsap.to(glowRef.current, {
          opacity: 0.98,
          scale: 1.12,
          duration: 5.8,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          transformOrigin: '50% 50%',
        });
      }

      if (sheenRef.current) {
        gsap.to(sheenRef.current, {
          xPercent: 34,
          opacity: 0.74,
          duration: 4.8,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          transformOrigin: '50% 50%',
        });
      }

      ringRefs.current.forEach((ring, index) => {
        if (!ring) return;
        gsap.to(ring, {
          rotation: index % 2 ? -360 : 360,
          duration: 34 + index * 8,
          ease: 'none',
          repeat: -1,
          transformOrigin: '50% 50%',
        });
      });

      particleRefs.current.forEach((particle, index) => {
        if (!particle) return;
        gsap.to(particle, {
          x: index % 2 ? -12 : 12,
          y: index % 3 ? -18 : 16,
          opacity: PARTICLES[index]?.[2] ?? 0.5,
          duration: 4.2 + index * 0.45,
          delay: PARTICLES[index]?.[3] ?? 0,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      });
    });

    if (sceneRef.current) {
      const rotateXTo = gsap.quickTo(shellRef.current, 'rotationX', { duration: 0.75, ease: 'power3.out' });
      const rotateYTo = gsap.quickTo(shellRef.current, 'rotationY', { duration: 0.75, ease: 'power3.out' });
      const xTo = gsap.quickTo(shellRef.current, 'x', { duration: 0.75, ease: 'power3.out' });
      const yTo = gsap.quickTo(shellRef.current, 'y', { duration: 0.75, ease: 'power3.out' });

      const handlePointerMove = (event) => {
        const bounds = sceneRef.current.getBoundingClientRect();
        const relX = (event.clientX - bounds.left) / bounds.width - 0.5;
        const relY = (event.clientY - bounds.top) / bounds.height - 0.5;
        rotateYTo(relX * 12);
        rotateXTo(relY * -10);
        xTo(relX * 14);
        yTo(relY * 10 - 10);
      };

      const handlePointerLeave = () => {
        rotateXTo(0);
        rotateYTo(0);
        xTo(0);
        yTo(0);
      };

      sceneRef.current.addEventListener('pointermove', handlePointerMove);
      sceneRef.current.addEventListener('pointerleave', handlePointerLeave);
      cleanup.push(() => {
        sceneRef.current?.removeEventListener('pointermove', handlePointerMove);
        sceneRef.current?.removeEventListener('pointerleave', handlePointerLeave);
      });
    }

    return () => {
      cleanup.forEach((dispose) => dispose());
      ctx.revert();
    };
  }, [imageFailed, imageReady, reducedMotion]);

  if (imageFailed) {
    return <SolanaGlobe reducedMotion={reducedMotion} />;
  }

  return (
    <div ref={sceneRef} className="relative aspect-square w-full max-w-[860px] [perspective:1400px]">
      <div
        ref={glowRef}
        aria-hidden
        className="absolute inset-[4%] rounded-[46px] bg-[radial-gradient(circle_at_68%_36%,rgba(255,255,255,0.64),rgba(248,230,182,0.30)_28%,rgba(214,168,79,0.16)_52%,rgba(126,77,34,0.08)_74%,rgba(126,77,34,0)_90%)] blur-3xl"
      />

      {[0, 1, 2].map((ring) => (
        <div
          key={ring}
          ref={(el) => {
            ringRefs.current[ring] = el;
          }}
          aria-hidden
          className={`pointer-events-none absolute rounded-full ${
            ring === 0
              ? 'inset-[12%]'
              : ring === 1
                ? 'inset-[18%]'
                : 'inset-[25%]'
          }`}
        >
          <div
            className={`h-full w-full rounded-full border ${
              ring === 0
                ? 'border-[#D6A84F]/24'
                : ring === 1
                  ? 'border-white/44'
                  : 'border-[#7E4D22]/14'
            }`}
            style={{
              transform:
                ring === 0
                  ? 'rotateX(68deg) rotateZ(-18deg)'
                  : ring === 1
                    ? 'rotateX(58deg) rotateZ(28deg)'
                    : 'rotateX(74deg) rotateZ(56deg)',
            }}
          />
        </div>
      ))}

      {PARTICLES.map(([left, top, opacity], index) => (
        <span
          key={`${left}-${top}`}
          ref={(el) => {
            particleRefs.current[index] = el;
          }}
          aria-hidden
          className="pointer-events-none absolute z-[3] h-1.5 w-1.5 rounded-full bg-[#F8E6B6] shadow-[0_0_22px_rgba(214,168,79,0.85)]"
          style={{ left, top, opacity }}
        />
      ))}

      {!imageReady ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full max-w-[860px]">
            <SolanaGlobe reducedMotion={reducedMotion} />
          </div>
        </div>
      ) : null}

      <div
        ref={floatRef}
        className={`relative h-full w-full transition-opacity duration-500 ${imageReady ? 'opacity-100' : 'opacity-0'}`}
      >
        <div ref={shellRef} className="relative h-full w-full [transform-style:preserve-3d]">
          <div
            aria-hidden
            className="absolute inset-[12%] z-0 rounded-full bg-[radial-gradient(circle,rgba(42,26,11,0.18),rgba(126,77,34,0.08)_45%,transparent_72%)] blur-2xl"
            style={{ transform: 'translateZ(-86px)' }}
          />

          <img
            ref={imageRef}
            src={HERO_GLOBE_SRC}
            alt="Yieldiz hero globe artwork"
            className="relative z-[1] h-full w-full object-contain drop-shadow-[0_44px_96px_rgba(126,77,34,0.20)]"
            style={{ transform: 'translateZ(52px)' }}
            decoding="async"
            fetchPriority="high"
            onLoad={() => setImageReady(true)}
            onError={() => setImageFailed(true)}
          />

          <div
            ref={sheenRef}
            aria-hidden
            className="pointer-events-none absolute inset-y-[11%] right-[7%] z-[2] w-[38%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.68),rgba(248,230,182,0.28)_42%,rgba(248,230,182,0)_72%)] opacity-40 blur-2xl mix-blend-screen"
            style={{ transform: 'translateZ(88px)' }}
          />
        </div>
      </div>
    </div>
  );
};
