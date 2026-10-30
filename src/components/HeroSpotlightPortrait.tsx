import React, { useEffect, useRef, useState } from 'react';
import localBg1 from '../assets/images/cyberpunk_hero_bg1.png';
import localBg2 from '../assets/images/cyberpunk_hero_bg2.png';
import saadPortraitCutout from '../assets/images/regenerated_image_1785895097597.png';
import saadCutoutAlt from '../assets/images/saad_cutout_png_1785843753308.jpg';
import saadHeadshot from '../assets/images/saad_avatar_headshot_1785846847266.jpg';

// User provided Kommodo image links:
// Link 1 (Base): https://kommodo.ai/i/zyKbIiEAZ6DVmGsPXSgN
// Link 2 (Reveal): https://kommodo.ai/i/DaGotVA49jAyyb5d0cIt
export const BG_IMAGE_1 = 'https://plain-eeur-prod-public.komododecks.com/202610/23/zyKbIiEAZ6DVmGsPXSgN/image.png';
export const BG_IMAGE_2 = 'https://plain-eeur-prod-public.komododecks.com/202610/23/DaGotVA49jAyyb5d0cIt/image.png';

export const resolveImageUrl = (url: string): string => {
  if (!url) return '';
  const match = url.match(/kommodo\.ai\/i\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://plain-eeur-prod-public.komododecks.com/202610/23/${match[1]}/image.png`;
  }
  return url;
};

interface HeroSpotlightPortraitProps {
  rotateX?: unknown;
  rotateY?: unknown;
  baseImage?: string;
  revealImage?: string;
}

export const HeroSpotlightPortrait: React.FC<HeroSpotlightPortraitProps> = ({
  baseImage = BG_IMAGE_1,
  revealImage = BG_IMAGE_2,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const revealLayerRef = useRef<HTMLDivElement | null>(null);

  const [baseSrc, setBaseSrc] = useState<string>(() => resolveImageUrl(baseImage) || localBg1);
  const [revealSrc, setRevealSrc] = useState<string>(() => resolveImageUrl(revealImage) || localBg2);

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

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
    };
  }, []);

  const handleBaseError = () => {
    if (baseSrc !== localBg1) {
      setBaseSrc(localBg1);
    } else if (baseSrc !== saadPortraitCutout) {
      setBaseSrc(saadPortraitCutout);
    } else if (baseSrc !== saadCutoutAlt) {
      setBaseSrc(saadCutoutAlt);
    }
  };

  const handleRevealError = () => {
    if (revealSrc !== localBg2) {
      setRevealSrc(localBg2);
    } else if (revealSrc !== saadPortraitCutout) {
      setRevealSrc(saadPortraitCutout);
    } else if (revealSrc !== saadHeadshot) {
      setRevealSrc(saadHeadshot);
    }
  };

  return (
    <div className="relative w-full flex flex-col justify-end items-center lg:items-end cursor-pointer touch-pan-y">
      {/* Frameless Portrait Container - Height 820px, zero cropping */}
      <div
        ref={containerRef}
        id="hero-frameless-spotlight-portrait"
        className="relative select-none flex items-end justify-center lg:justify-end w-full h-[620px] sm:h-[720px] lg:h-[820px] overflow-hidden"
      >
        {/* Layer 1: Dark Luxury Noir Base Portrait (Base Animation Image) */}
        <img
          src={baseSrc}
          alt="Saad Ahmed UI/UX Designer - Base Hero"
          onError={handleBaseError}
          referrerPolicy="no-referrer"
          className="w-auto h-[620px] sm:h-[720px] lg:h-[820px] max-w-full object-contain pointer-events-none block origin-bottom filter grayscale contrast-[1.12] brightness-[0.88] opacity-95 transition-opacity duration-300"
          style={{
            maskImage: 'linear-gradient(to bottom, black 88%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 88%, transparent 100%)',
          }}
        />

        {/* Layer 2: Interactive Spotlight Reveal Layer (Reveal Animation Image) */}
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
          {/* Natural vivid reveal portrait without red lighting or glow */}
          <img
            src={revealSrc}
            alt="Saad Ahmed Spotlight Reveal"
            onError={handleRevealError}
            referrerPolicy="no-referrer"
            className="w-auto h-[620px] sm:h-[720px] lg:h-[820px] max-w-full object-contain pointer-events-none block origin-bottom brightness-[1.04] contrast-[1.1]"
            style={{
              maskImage: 'linear-gradient(to bottom, black 88%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 88%, transparent 100%)',
            }}
          />
        </div>

        {/* Soft Bottom Fade Blend to eliminate any harsh edge */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#080808] via-[#080808]/70 to-transparent pointer-events-none z-10" />
      </div>
    </div>
  );
};
