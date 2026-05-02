import React, { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { SolanaGlobe } from './SolanaGlobe';

const HERO_GLOBE_SRC = '/marketing/hero-globe-master.png';

export const HeroGlobe = ({ reducedMotion = false }) => {
  const shellRef = useRef(null);
  const imageRef = useRef(null);
  const glowRef = useRef(null);
  const sheenRef = useRef(null);
  const [imageReady, setImageReady] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  useLayoutEffect(() => {
    if (reducedMotion || imageFailed || !imageReady || !shellRef.current) return undefined;

    const ctx = gsap.context(() => {
      gsap.to(shellRef.current, {
        y: -10,
        scale: 1.018,
        duration: 6.8,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        transformOrigin: '50% 50%',
      });

      if (glowRef.current) {
        gsap.to(glowRef.current, {
          opacity: 0.86,
          scale: 1.04,
          duration: 6.8,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          transformOrigin: '50% 50%',
        });
      }

      if (sheenRef.current) {
        gsap.to(sheenRef.current, {
          xPercent: 10,
          opacity: 0.52,
          duration: 8.4,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          transformOrigin: '50% 50%',
        });
      }
    });

    return () => ctx.revert();
  }, [imageFailed, imageReady, reducedMotion]);

  if (imageFailed) {
    return <SolanaGlobe reducedMotion={reducedMotion} />;
  }

  return (
    <div className="relative aspect-[3/2] w-full max-w-[900px]">
      <div
        ref={glowRef}
        aria-hidden
        className="absolute inset-[6%] rounded-[40px] bg-[radial-gradient(circle_at_70%_38%,rgba(214,168,79,0.30),rgba(248,230,182,0.18)_42%,rgba(126,77,34,0.08)_72%,rgba(126,77,34,0)_88%)] blur-3xl"
      />

      {!imageReady ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full max-w-[720px]">
            <SolanaGlobe reducedMotion={reducedMotion} />
          </div>
        </div>
      ) : null}

      <div
        ref={shellRef}
        className={`relative h-full w-full transition-opacity duration-500 ${imageReady ? 'opacity-100' : 'opacity-0'}`}
      >
        <img
          ref={imageRef}
          src={HERO_GLOBE_SRC}
          alt="Yieldiz hero globe artwork"
          className="relative z-[1] h-full w-full object-contain drop-shadow-[0_40px_90px_rgba(126,77,34,0.18)]"
          decoding="async"
          fetchPriority="high"
          onLoad={() => setImageReady(true)}
          onError={() => setImageFailed(true)}
        />

        <div
          ref={sheenRef}
          aria-hidden
          className="pointer-events-none absolute inset-y-[14%] right-[9%] z-[2] w-[34%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.58),rgba(248,230,182,0.24)_42%,rgba(248,230,182,0)_72%)] opacity-35 blur-2xl mix-blend-screen"
        />
      </div>
    </div>
  );
};

