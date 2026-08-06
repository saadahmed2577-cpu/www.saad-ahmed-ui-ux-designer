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
  });

  const hoverRef = useRef({
    isHovering: false,
  });

  const pointsRef = useRef<Point[]>([]);
  const animFrameRef = useRef<number | null>(null);

  const POINT_COUNT = 18; // Smooth, tight trailing silk ribbon length

  useEffect(() => {
    const checkMobile = () => {
      const isTouch = window.matchMedia('(max-width: 768px)').matches || 'ontouchstart' in window;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setIsMobile(isTouch || prefersReducedMotion);
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
        hoverRef.current.isHovering = false;
        return;
      }

      // Detect hover state on interactive controls and content elements
      const interactive = target.closest(
        'button, a, input, select, textarea, [role="button"], .glass-card, [data-card], img, .group\\/img, svg, .interactive-hover, [data-hover], span, p, h1, h2, h3, h4, li, div'
      );
      hoverRef.current.isHovering = Boolean(interactive);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Render Loop
    const renderLoop = () => {
      const mouse = mouseRef.current;
      const hover = hoverRef.current;
      const points = pointsRef.current;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (mouse.hasMoved) {
        // Calculate distance & speed
        const dx = mouse.targetX - mouse.x;
        const dy = mouse.targetY - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        mouse.speed += (dist - mouse.speed) * 0.2;

        // Mouse head strictly lerps directly to current mouse cursor position
        mouse.x += dx * 0.55;
        mouse.y += dy * 0.55;

        // Head point is glued to mouse position
        points[0].x = mouse.x;
        points[0].y = mouse.y;

        // Trailing points strictly follow the predecessor point with clean easing (No Floating / Drifting)
        for (let i = 1; i < points.length; i++) {
          const pt = points[i];
          const prev = points[i - 1];
          // Smooth progressive spring delay along the ribbon tail
          const followRate = 0.48 - (i / points.length) * 0.16;

          pt.x += (prev.x - pt.x) * followRate;
          pt.y += (prev.y - pt.y) * followRate;
        }

        // Render Ribbon Line
        if (points.length > 2) {
          ctx.save();

          // Outer Glow
          const baseGlow = hover.isHovering ? 22 : 12;
          ctx.shadowColor = hover.isHovering ? 'rgba(217, 30, 42, 0.9)' : 'rgba(217, 30, 42, 0.55)';
          ctx.shadowBlur = baseGlow + Math.min(mouse.speed * 0.1, 8);

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
          ctx.lineWidth = hover.isHovering ? 3.4 : Math.min(2.2 + mouse.speed * 0.02, 3.4);
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
          ctx.lineWidth = hover.isHovering ? 1.0 : 0.8;
          ctx.globalAlpha = 0.9;
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
          ctx.shadowBlur = hover.isHovering ? 16 : 10;

          ctx.beginPath();
          ctx.arc(points[0].x, points[0].y, hover.isHovering ? 4.2 : 3.2, 0, Math.PI * 2);
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
