import React, { useEffect, useRef, useState } from 'react';
import saadPortraitCutout from '../assets/images/regenerated_image_1785895097597.png';
import saadCutoutAlt from '../assets/images/saad_cutout_png_1785843753308.jpg';
import saadHeadshot from '../assets/images/saad_avatar_headshot_1785846847266.jpg';

interface HeroSpotlightPortraitProps {
  rotateX?: unknown;
  rotateY?: unknown;
}

export const HeroSpotlightPortrait: React.FC<HeroSpotlightPortraitProps> = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const revealLayerRef = useRef<HTMLDivElement | null>(null);
  const hudReticleRef = useRef<HTMLDivElement | null>(null);
  const [imgSrc, setImgSrc] = useState(saadPortraitCutout);

  useEffect(() => {
    let animFrameId: number;
    let targetX = -999;
    let targetY = -999;
    let currX = -999;
    let currY = -999;
    let hasInteracted = false;
    let idleAngle = 0;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      let clientX = 0;
      let clientY = 0;

      if ('touches' in e) {
        if (e.touches.length === 0) return;
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      // Allow a generous interaction area around the hero portrait
      const inside =
        clientX >= rect.left - 120 &&
        clientX <= rect.right + 120 &&
        clientY >= rect.top - 80 &&
        clientY <= rect.bottom + 80;

      if (inside) {
        hasInteracted = true;
        targetX = Math.max(0, Math.min(rect.width, clientX - rect.left));
        targetY = Math.max(0, Math.min(rect.height, clientY - rect.top));
      } else {
        hasInteracted = false;
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    const render = () => {
      if (!containerRef.current || !revealLayerRef.current) {
        animFrameId = requestAnimationFrame(render);
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      const containerW = rect.width || 600;
      const containerH = rect.height || 820;

      if (!hasInteracted) {
        // Smooth idle ambient breathing orbit around Saad's upper chest / face
        idleAngle += 0.02;
        const centerX = containerW * 0.52 + Math.cos(idleAngle) * 35;
        const centerY = containerH * 0.32 + Math.sin(idleAngle * 0.8) * 25;
        targetX = centerX;
        targetY = centerY;
      }

      if (currX === -999 || currY === -999) {
        currX = targetX;
        currY = targetY;
      } else {
        currX += (targetX - currX) * 0.12;
        currY += (targetY - currY) * 0.12;
      }

      const radius = Math.max(240, Math.min(360, containerW * 0.45));
      const mask = `radial-gradient(circle ${radius.toFixed(0)}px at ${currX.toFixed(1)}px ${currY.toFixed(1)}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 30%, rgba(0,0,0,0.65) 55%, rgba(0,0,0,0.2) 78%, transparent 100%)`;

      revealLayerRef.current.style.maskImage = mask;
      revealLayerRef.current.style.webkitMaskImage = mask;

      // Update cyberpunk reticle position
      if (hudReticleRef.current) {
        hudReticleRef.current.style.transform = `translate3d(${(currX - 40).toFixed(1)}px, ${(currY - 40).toFixed(1)}px, 0)`;
        hudReticleRef.current.style.opacity = hasInteracted ? '0.85' : '0.4';
      }

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
    };
  }, []);

  const handleImageError = () => {
    if (imgSrc !== saadCutoutAlt) {
      setImgSrc(saadCutoutAlt);
    } else if (imgSrc !== saadHeadshot) {
      setImgSrc(saadHeadshot);
    }
  };

  return (
    <div className="relative w-full flex flex-col justify-end items-center lg:items-end cursor-crosshair touch-pan-y">
      {/* Frameless Portrait Container - Height 820px, zero cropping */}
      <div
        ref={containerRef}
        id="hero-frameless-spotlight-portrait"
        className="relative select-none flex items-end justify-center lg:justify-end w-full h-[620px] sm:h-[720px] lg:h-[820px] overflow-hidden"
      >
        {/* Layer 1: Dark Luxury Noir Base Portrait */}
        <img
          src={imgSrc}
          alt="Saad Ahmed UI/UX Designer"
          onError={handleImageError}
          referrerPolicy="no-referrer"
          className="w-auto h-[620px] sm:h-[720px] lg:h-[820px] max-w-full object-contain pointer-events-none block origin-bottom filter grayscale contrast-[1.12] brightness-[0.88] opacity-95 transition-opacity duration-300"
          style={{
            maskImage: 'linear-gradient(to bottom, black 88%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 88%, transparent 100%)',
          }}
        />

        {/* Layer 2: Interactive Cyberpunk Red Spotlight Reveal Layer */}
        <div
          ref={revealLayerRef}
          id="hero-reveal-image"
          className="absolute inset-0 flex items-end justify-center lg:justify-end pointer-events-none will-change-[mask-image]"
          style={{
            maskSize: '100% 100%',
            WebkitMaskSize: '100% 100%',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskImage: 'radial-gradient(circle 280px at 50% 32%, black 0%, rgba(0,0,0,0.85) 45%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(circle 280px at 50% 32%, black 0%, rgba(0,0,0,0.85) 45%, transparent 100%)',
          }}
        >
          {/* Cyberpunk vivid colored portrait with crimson illumination and edge glow */}
          <img
            src={imgSrc}
            alt="Saad Ahmed Cyberpunk Reveal"
            onError={handleImageError}
            referrerPolicy="no-referrer"
            className="w-auto h-[620px] sm:h-[720px] lg:h-[820px] max-w-full object-contain pointer-events-none block origin-bottom filter drop-shadow-[0_0_25px_rgba(217,30,42,0.85)] drop-shadow-[0_0_55px_rgba(217,30,42,0.45)] brightness-[1.08] contrast-[1.2] saturate-[1.25]"
            style={{
              maskImage: 'linear-gradient(to bottom, black 88%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 88%, transparent 100%)',
            }}
          />

          {/* Futuristic Cyber Scan Grid Overlay inside the spotlight */}
          <div
            className="absolute inset-0 pointer-events-none opacity-25 mix-blend-screen"
            style={{
              backgroundImage: 'linear-gradient(rgba(217, 30, 42, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(217, 30, 42, 0.3) 1px, transparent 1px)',
              backgroundSize: '36px 36px',
            }}
          />
        </div>

        {/* Layer 3: Floating Cyberpunk HUD Targeting Reticle */}
        <div
          ref={hudReticleRef}
          className="absolute top-0 left-0 w-20 h-20 pointer-events-none transition-opacity duration-300 z-20 hidden sm:block"
        >
          {/* Outer Rotating Ring */}
          <div className="absolute inset-0 rounded-full border border-[#D91E2A]/60 animate-spin-slow" />
          {/* Center Crosshair */}
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D91E2A] to-transparent" />
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#D91E2A] to-transparent" />
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-mono tracking-widest text-[#D91E2A] uppercase bg-black/80 px-1.5 py-0.5 rounded border border-[#D91E2A]/40">
            SYS: ACTIVE // SAAD
          </div>
        </div>

        {/* Soft Bottom Fade Blend to eliminate any harsh edge */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#080808] via-[#080808]/70 to-transparent pointer-events-none z-10" />
      </div>
    </div>
  );
};
