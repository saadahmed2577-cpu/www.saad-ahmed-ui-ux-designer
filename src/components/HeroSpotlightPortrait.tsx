import React, { useEffect, useRef } from 'react';
import { motion, MotionValue } from 'motion/react';

const BG_IMAGE_1 =
  'https://cdn.phototourl.com/free/2026-09-14-0a8baeec-a3a6-462a-82c7-5d23cb124bd8.png';

const BG_IMAGE_2 =
  'https://cdn.phototourl.com/free/2026-09-14-97263ce4-49ce-4cbd-9c75-038e93a2f689.png';

interface HeroSpotlightPortraitProps {
  rotateX?: MotionValue<number>;
  rotateY?: MotionValue<number>;
}

export const HeroSpotlightPortrait: React.FC<HeroSpotlightPortraitProps> = ({
  rotateX,
  rotateY,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const revealLayerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let animFrameId: number;
    let targetX = -999;
    let targetY = -999;
    let currX = -999;
    let currY = -999;
    let hasInteracted = false;

    const offscreenCanvas = document.createElement('canvas');
    const offscreenCtx = offscreenCanvas.getContext('2d');

    const updateCanvasSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        offscreenCanvas.width = Math.round(rect.width) || 1200;
        offscreenCanvas.height = Math.round(rect.height) || 820;
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

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

      const inside =
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom;

      if (inside) {
        hasInteracted = true;
        targetX = clientX - rect.left;
        targetY = clientY - rect.top;
      } else {
        targetX = -999;
        targetY = -999;
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    const render = () => {
      if (hasInteracted) {
        currX += (targetX - currX) * 0.1;
        currY += (targetY - currY) * 0.1;
      }

      if (offscreenCtx && revealLayerRef.current && hasInteracted) {
        offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);

        if (currX > -400 && currY > -400) {
          const radius = 340;
          const gradient = offscreenCtx.createRadialGradient(
            currX,
            currY,
            0,
            currX,
            currY,
            radius
          );

          gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
          gradient.addColorStop(0.4, 'rgba(0, 0, 0, 1)');
          gradient.addColorStop(0.6, 'rgba(0, 0, 0, 0.75)');
          gradient.addColorStop(0.75, 'rgba(0, 0, 0, 0.4)');
          gradient.addColorStop(0.88, 'rgba(0, 0, 0, 0.12)');
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

          offscreenCtx.fillStyle = gradient;
          offscreenCtx.beginPath();
          offscreenCtx.arc(currX, currY, radius, 0, Math.PI * 2);
          offscreenCtx.fill();

          const maskUrl = `url(${offscreenCanvas.toDataURL()})`;
          revealLayerRef.current.style.webkitMaskImage = maskUrl;
          revealLayerRef.current.style.maskImage = maskUrl;
        }
      }

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  return (
    <motion.div
      style={
        rotateX && rotateY
          ? { rotateX, rotateY, transformStyle: 'preserve-3d' }
          : undefined
      }
      className="relative w-full flex flex-col justify-end items-center lg:items-end cursor-pointer perspective-1000 touch-pan-y"
    >
      {/* Frameless Portrait Container - Height 820px with zero cropping */}
      <div
        ref={containerRef}
        id="hero-frameless-spotlight-portrait"
        className="relative select-none flex items-end justify-center lg:justify-end w-full h-[620px] sm:h-[720px] lg:h-[820px]"
      >
        {/* Layer 1: Base Image (BG_IMAGE_1) rendered at true height 820px with object-contain so it NEVER cuts */}
        <img
          src={BG_IMAGE_1}
          alt="Saad Ahmed"
          className="w-auto h-[620px] sm:h-[720px] lg:h-[820px] max-w-full object-contain pointer-events-none ken-burns block origin-bottom"
          style={{
            maskImage: 'linear-gradient(to bottom, black 90%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 90%, transparent 100%)',
          }}
        />

        {/* Layer 2: Cursor Spotlight Reveal Layer (BG_IMAGE_2) matching Layer 1 100% */}
        <div
          ref={revealLayerRef}
          id="hero-reveal-image"
          className="absolute inset-0 flex items-end justify-center lg:justify-end pointer-events-none"
          style={{
            maskSize: '100% 100%',
            WebkitMaskSize: '100% 100%',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            WebkitMaskImage: 'radial-gradient(circle at 50% 30%, black 0%, rgba(0,0,0,0.8) 25%, transparent 65%)',
            maskImage: 'radial-gradient(circle at 50% 30%, black 0%, rgba(0,0,0,0.8) 25%, transparent 65%)',
          }}
        >
          <img
            src={BG_IMAGE_2}
            alt="Saad Ahmed Cyberpunk Reveal"
            className="w-auto h-[620px] sm:h-[720px] lg:h-[820px] max-w-full object-contain pointer-events-none block origin-bottom"
          />
        </div>

        {/* Soft Bottom Fade Blend */}
        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#080808] via-[#080808]/60 to-transparent pointer-events-none z-10" />
      </div>
    </motion.div>
  );
};
