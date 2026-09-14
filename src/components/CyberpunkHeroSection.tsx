import React, { useEffect, useRef } from 'react';

const BG_IMAGE_1 =
  'https://cdn.phototourl.com/free/2026-09-14-0a8baeec-a3a6-462a-82c7-5d23cb124bd8.png';

const BG_IMAGE_2 =
  'https://cdn.phototourl.com/free/2026-09-14-97263ce4-49ce-4cbd-9c75-038e93a2f689.png';

interface CyberpunkHeroSectionProps {
  onReserveClick?: () => void;
}

export const CyberpunkHeroSection: React.FC<CyberpunkHeroSectionProps> = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const revealLayerRef = useRef<HTMLDivElement | null>(null);
  const gridContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let animFrameId: number;
    let targetMouseX = -999;
    let targetMouseY = -999;
    let currMouseX = -999;
    let currMouseY = -999;

    let normX = 0.5;
    let normY = 0.5;
    let currGridX = 0;
    let currGridY = 0;
    let hasInteracted = false;

    // Full hidden canvas used to dynamically draw smooth radial gradient mask
    const offscreenCanvas = document.createElement('canvas');
    const offscreenCtx = offscreenCanvas.getContext('2d');

    const updateCanvasDimensions = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        offscreenCanvas.width = Math.max(rect.width, window.innerWidth);
        offscreenCanvas.height = Math.max(rect.height, window.innerHeight);
      } else {
        offscreenCanvas.width = window.innerWidth;
        offscreenCanvas.height = window.innerHeight;
      }
    };

    updateCanvasDimensions();
    window.addEventListener('resize', updateCanvasDimensions);

    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();

      // Check if mouse is hovering within or close to this section
      const isOverSection = (
        e.clientY >= rect.top - 80 &&
        e.clientY <= rect.bottom + 80 &&
        e.clientX >= rect.left &&
        e.clientX <= rect.right
      );

      if (isOverSection) {
        hasInteracted = true;
        targetMouseX = e.clientX - rect.left;
        targetMouseY = e.clientY - rect.top;
        normX = targetMouseX / (rect.width || 1);
        normY = targetMouseY / (rect.height || 1);
      } else {
        // Move spotlight off-canvas when cursor exits
        targetMouseX = -999;
        targetMouseY = -999;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!sectionRef.current || e.touches.length === 0) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const touch = e.touches[0];

      if (
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom &&
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right
      ) {
        hasInteracted = true;
        targetMouseX = touch.clientX - rect.left;
        targetMouseY = touch.clientY - rect.top;
        normX = targetMouseX / (rect.width || 1);
        normY = targetMouseY / (rect.height || 1);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Render loop: lerps cursor position with factor 0.1, draws radial mask and updates mask-image
    const renderLoop = () => {
      if (hasInteracted) {
        currMouseX += (targetMouseX - currMouseX) * 0.1;
        currMouseY += (targetMouseY - currMouseY) * 0.1;
      }

      // Parallax lerp for background grid
      const targetGridX = (normX - 0.5) * 16;
      const targetGridY = (normY - 0.5) * 16;
      currGridX += (targetGridX - currGridX) * 0.06;
      currGridY += (targetGridY - currGridY) * 0.06;

      if (gridContainerRef.current) {
        gridContainerRef.current.style.transform = `translate3d(${currGridX.toFixed(2)}px, ${currGridY.toFixed(2)}px, 0)`;
      }

      // Render spotlight mask on reveal layer
      if (offscreenCtx && revealLayerRef.current && hasInteracted) {
        offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);

        if (currMouseX > -500 && currMouseY > -500) {
          const radius = 260;
          const gradient = offscreenCtx.createRadialGradient(
            currMouseX,
            currMouseY,
            0,
            currMouseX,
            currMouseY,
            radius
          );

          // Specified gradient stops
          gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
          gradient.addColorStop(0.4, 'rgba(0, 0, 0, 1)');
          gradient.addColorStop(0.6, 'rgba(0, 0, 0, 0.75)');
          gradient.addColorStop(0.75, 'rgba(0, 0, 0, 0.4)');
          gradient.addColorStop(0.88, 'rgba(0, 0, 0, 0.12)');
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

          offscreenCtx.fillStyle = gradient;
          offscreenCtx.beginPath();
          offscreenCtx.arc(currMouseX, currMouseY, radius, 0, Math.PI * 2);
          offscreenCtx.fill();

          const maskDataUrl = `url(${offscreenCanvas.toDataURL()})`;
          revealLayerRef.current.style.webkitMaskImage = maskDataUrl;
          revealLayerRef.current.style.maskImage = maskDataUrl;
        }
      }

      animFrameId = requestAnimationFrame(renderLoop);
    };

    animFrameId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', updateCanvasDimensions);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="cyberpunk"
      className="relative min-h-screen w-full overflow-hidden bg-black select-none border-y border-white/10"
      style={{ height: '100vh', maxHeight: '1080px' }}
    >
      {/* Layer 1: Atmospheric Grid Background (z-10) with Parallax */}
      <div
        ref={gridContainerRef}
        className="absolute -inset-8 z-10 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, #64748b 0.6px, transparent 0.6px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Layer 2: Base Image (z-5) with Ken Burns Intro */}
      <div
        id="base-hero-image"
        className="absolute inset-0 z-5 bg-center bg-cover ken-burns"
        style={{
          backgroundImage: `url('${BG_IMAGE_1}')`,
        }}
      />

      {/* Layer 3: Cursor Spotlight Reveal Layer (z-20) */}
      <div
        ref={revealLayerRef}
        id="reveal-hero-image"
        className="absolute inset-0 z-20 bg-center bg-cover pointer-events-none"
        style={{
          backgroundImage: `url('${BG_IMAGE_2}')`,
          maskSize: '100% 100%',
          WebkitMaskSize: '100% 100%',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskImage: 'radial-gradient(circle at 65% 35%, black 0%, rgba(0,0,0,0.8) 20%, transparent 60%)',
          maskImage: 'radial-gradient(circle at 65% 35%, black 0%, rgba(0,0,0,0.8) 20%, transparent 60%)',
        }}
      />

      {/* Subtle Ambient Gradient Overlays for smooth transition */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/80 to-transparent pointer-events-none z-20" />
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-20" />
    </section>
  );
};
