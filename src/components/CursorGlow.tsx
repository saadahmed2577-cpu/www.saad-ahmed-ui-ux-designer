import React, { useEffect, useRef, useState } from 'react';

interface Point {
  x: number;
  y: number;
}

export const CursorGlow: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Position & hover state refs for 60-120 FPS performance
  const mouseRef = useRef({
    x: -200,
    y: -200,
    targetX: -200,
    targetY: -200,
    speed: 0,
    hasMoved: false,
    isInside: false,
  });

  const stateRef = useRef({
    opacity: 0,
    targetOpacity: 0,
    hoverFactor: 0,
    targetHoverFactor: 0,
    lastMovedTime: Date.now(),
  });

  const pointsRef = useRef<Point[]>([]);
  const animFrameRef = useRef<number | null>(null);

  const POINT_COUNT = 18; // Smooth, tight trailing silk ribbon length

  useEffect(() => {
    const checkMobile = () => {
      // Only disable on touch-only mobile devices with small screens
      // Keep enabled on touchscreen laptops and desktop computers with mouse/trackpad
      const isSmallTouchOnly = window.matchMedia('(max-width: 768px) and (pointer: coarse)').matches;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setIsMobile(isSmallTouchOnly || prefersReducedMotion);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // High DPI Canvas Scaling
    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Initialize Trailing Points
    const initialPoints: Point[] = [];
    for (let i = 0; i < POINT_COUNT; i++) {
      initialPoints.push({ x: -200, y: -200 });
    }
    pointsRef.current = initialPoints;

    // Mouse Movement Listener (Strictly Tracks Real Cursor Coordinates)
    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const mouse = mouseRef.current;
      const state = stateRef.current;

      state.lastMovedTime = Date.now();
      state.targetOpacity = 1;
      mouse.isInside = true;

      if (!mouse.hasMoved) {
        mouse.x = mouseX;
        mouse.y = mouseY;
        mouse.targetX = mouseX;
        mouse.targetY = mouseY;
        mouse.hasMoved = true;
        for (let i = 0; i < POINT_COUNT; i++) {
          pointsRef.current[i].x = mouseX;
          pointsRef.current[i].y = mouseY;
        }
      } else {
        mouse.targetX = mouseX;
        mouse.targetY = mouseY;
      }

      const target = e.target as HTMLElement | null;
      if (!target) {
        state.targetHoverFactor = 0;
        return;
      }

      // Detect hover state on interactive controls and clickable elements
      const isInteractive = Boolean(
        target.closest(
          'button, a, input, select, textarea, [role="button"], [role="link"], .glass-card, [data-card], img, .cursor-pointer, [data-hover], label, .group\\/btn'
        )
      );
      state.targetHoverFactor = isInteractive ? 1 : 0;
    };

    const handleMouseLeave = () => {
      mouseRef.current.isInside = false;
      stateRef.current.targetOpacity = 0;
      stateRef.current.targetHoverFactor = 0;
    };

    const handleMouseEnter = () => {
      mouseRef.current.isInside = true;
      stateRef.current.targetOpacity = 1;
      stateRef.current.lastMovedTime = Date.now();
    };

    const handleBlur = () => {
      mouseRef.current.isInside = false;
      stateRef.current.targetOpacity = 0;
      stateRef.current.targetHoverFactor = 0;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('blur', handleBlur);

    // Render Loop
    const renderLoop = () => {
      const mouse = mouseRef.current;
      const state = stateRef.current;
      const points = pointsRef.current;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Inactivity or leave fade-out check
      const timeSinceMove = Date.now() - state.lastMovedTime;
      if (timeSinceMove > 3000) {
        state.targetOpacity = 0;
      }

      // Smooth opacity lerp
      state.opacity += (state.targetOpacity - state.opacity) * 0.12;

      // Smooth hover factor lerp (elastic breathing)
      state.hoverFactor += (state.targetHoverFactor - state.hoverFactor) * 0.18;

      if (mouse.hasMoved && state.opacity > 0.01) {
        // Calculate distance & speed
        const dx = mouse.targetX - mouse.x;
        const dy = mouse.targetY - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        mouse.speed += (dist - mouse.speed) * 0.2;

        // Mouse head strictly lerps directly to current mouse cursor position
        mouse.x += dx * 0.6;
        mouse.y += dy * 0.6;

        // Head point is glued to mouse position
        points[0].x = mouse.x;
        points[0].y = mouse.y;

        // Trailing points strictly follow the predecessor point with clean easing
        for (let i = 1; i < points.length; i++) {
          const pt = points[i];
          const prev = points[i - 1];
          const followRate = 0.52 - (i / points.length) * 0.18;

          pt.x += (prev.x - pt.x) * followRate;
          pt.y += (prev.y - pt.y) * followRate;
        }

        // Render Ribbon Line
        if (points.length > 2) {
          ctx.save();
          ctx.globalAlpha = state.opacity;

          // Outer Glow
          const baseGlow = 12 + state.hoverFactor * 16;
          ctx.shadowColor = state.hoverFactor > 0.3 ? 'rgba(217, 30, 42, 0.95)' : 'rgba(217, 30, 42, 0.6)';
          ctx.shadowBlur = baseGlow + Math.min(mouse.speed * 0.1, 10);

          // Liquid Ruby Gradient from Head to Tail
          const headPt = points[0];
          const tailPt = points[points.length - 1];
          const endX = Math.abs(tailPt.x - headPt.x) < 2 ? headPt.x + 10 : tailPt.x;
          const endY = Math.abs(tailPt.y - headPt.y) < 2 ? headPt.y + 10 : tailPt.y;

          const rubyGrad = ctx.createLinearGradient(headPt.x, headPt.y, endX, endY);
          rubyGrad.addColorStop(0.0, '#FFFFFF');
          rubyGrad.addColorStop(0.25, '#FF8A95');
          rubyGrad.addColorStop(0.65, '#D91E2A');
          rubyGrad.addColorStop(1.0, '#A31520');

          ctx.strokeStyle = rubyGrad;
          ctx.lineWidth = 2.2 + state.hoverFactor * 1.6 + Math.min(mouse.speed * 0.02, 1.2);
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';

          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);

          // Quadratic Bezier Curve through trailing points
          for (let i = 1; i < points.length - 1; i++) {
            const xc = (points[i].x + points[i + 1].x) / 2;
            const yc = (points[i].y + points[i + 1].y) / 2;
            ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
          }

          ctx.stroke();

          // Satin Core Highlight
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 0.8 + state.hoverFactor * 0.4;
          ctx.globalAlpha = state.opacity * 0.9;
          ctx.shadowColor = '#FFFFFF';
          ctx.shadowBlur = 4;

          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);

          for (let i = 1; i < Math.floor(points.length * 0.5) - 1; i++) {
            const xc = (points[i].x + points[i + 1].x) / 2;
            const yc = (points[i].y + points[i + 1].y) / 2;
            ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
          }

          ctx.stroke();

          // Cursor Crystal Head Dot
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = '#D91E2A';
          ctx.shadowBlur = 10 + state.hoverFactor * 10;

          ctx.beginPath();
          ctx.arc(points[0].x, points[0].y, 3.2 + state.hoverFactor * 2.2, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }
      }

      animFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameRef.current = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('blur', handleBlur);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <canvas ref={canvasRef} className="block w-full h-full pointer-events-none" />
    </div>
  );
};
