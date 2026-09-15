import React, { useEffect } from 'react';

/**
 * Cinematic Tempered Glass Crack Interaction Engine
 * Triggers organic, multi-branching glass fractures precisely on mousedown/click
 * Supports multiple concurrent impact points and maintains 60 FPS performance.
 */
export interface BranchSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  subBranches: { x1: number; y1: number; x2: number; y2: number }[];
}

export interface CrackBranch {
  segments: BranchSegment[];
  progress: number;
  speed: number;
}

export interface CrackCluster {
  ox: number;
  oy: number;
  branches: CrackBranch[];
  opacity: number;
  pulseRadius: number;
  pulseAlpha: number;
  startTime: number;
  propagationComplete: boolean;
}

export interface GlassCrackState {
  element: HTMLElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  cracks: CrackCluster[];
  animationFrameId: number | null;
  width: number;
  height: number;
}

export class GlassCrackSystem {
  selector: string;
  states: GlassCrackState[] = [];
  globalState: GlassCrackState | null = null;
  private resizeHandlers: Array<() => void> = [];
  private dblclickHandler: ((e: MouseEvent) => void) | null = null;
  private touchHandler: ((e: TouchEvent) => void) | null = null;
  private lastTapTime = 0;
  private lastTapPos = { x: 0, y: 0 };

  constructor(
    selector = '.glass-panel, .crystal-element, [data-glass-crack], .glass-card, [data-glass], .crystal-glass'
  ) {
    this.selector = selector;
    this.init();
  }

  init() {
    // 1. Initialize per-element canvas for designated glass elements
    const elements = document.querySelectorAll<HTMLElement>(this.selector);

    elements.forEach((el) => {
      if (el.dataset.glassCrackInitialized) return;
      el.dataset.glassCrackInitialized = 'true';

      // Ensure element can contain the canvas properly
      if (getComputedStyle(el).position === 'static') {
        el.style.position = 'relative';
      }

      // Create canvas layer for this glass element
      const canvas = document.createElement('canvas');
      canvas.className = 'glass-crack-canvas';
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '35';
      canvas.style.borderRadius = 'inherit';

      el.appendChild(canvas);

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Store cracks and animation state for this element
      const state: GlassCrackState = {
        element: el,
        canvas,
        ctx,
        cracks: [],
        animationFrameId: null,
        width: 0,
        height: 0,
      };

      this.states.push(state);
      this.resizeCanvas(state);

      const resizeListener = () => this.resizeCanvas(state);
      window.addEventListener('resize', resizeListener, { passive: true });
      this.resizeHandlers.push(resizeListener);

      // Expose reset method on element for external triggers
      (el as unknown as { resetGlassCracks: () => void }).resetGlassCracks = () =>
        this.resetCracks(state);
    });

    // 2. Global full-viewport glass layer so double clicking ANYWHERE creates cracks
    let globalCanvas = document.getElementById(
      'global-glass-crack-canvas'
    ) as HTMLCanvasElement | null;
    if (!globalCanvas) {
      globalCanvas = document.createElement('canvas');
      globalCanvas.id = 'global-glass-crack-canvas';
      globalCanvas.className = 'glass-crack-canvas glass-crack-canvas-global';
      globalCanvas.style.position = 'fixed';
      globalCanvas.style.top = '0';
      globalCanvas.style.left = '0';
      globalCanvas.style.width = '100vw';
      globalCanvas.style.height = '100vh';
      globalCanvas.style.pointerEvents = 'none';
      globalCanvas.style.zIndex = '9999';
      document.body.appendChild(globalCanvas);
    }

    const globalCtx = globalCanvas.getContext('2d');
    if (globalCtx) {
      this.globalState = {
        element: document.body,
        canvas: globalCanvas,
        ctx: globalCtx,
        cracks: [],
        animationFrameId: null,
        width: window.innerWidth,
        height: window.innerHeight,
      };
      this.resizeCanvas(this.globalState);
      const globalResize = () => {
        if (this.globalState) this.resizeCanvas(this.globalState);
      };
      window.addEventListener('resize', globalResize, { passive: true });
      this.resizeHandlers.push(globalResize);
    }

    // 3. Double-Click Listener ("glass crack animation dabal click par chaly")
    this.dblclickHandler = (e: MouseEvent) => {
      // Trigger only on primary left mouse double click
      if (e.button !== 0) return;
      this.handleClick(e.clientX, e.clientY);
    };

    // Double-tap handler for touch devices (within 350ms and 35px radius)
    this.touchHandler = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        const now = Date.now();
        const dist = Math.hypot(touch.clientX - this.lastTapPos.x, touch.clientY - this.lastTapPos.y);

        if (now - this.lastTapTime < 350 && dist < 35) {
          // Double tap recognized!
          this.handleClick(touch.clientX, touch.clientY);
          this.lastTapTime = 0;
        } else {
          this.lastTapTime = now;
          this.lastTapPos = { x: touch.clientX, y: touch.clientY };
        }
      }
    };

    document.addEventListener('dblclick', this.dblclickHandler, { passive: true });
    document.addEventListener('touchstart', this.touchHandler, { passive: true });
  }

  handleClick(clientX: number, clientY: number) {
    // Check if clicked inside any specific glass element first
    const target = document.elementFromPoint(clientX, clientY) as HTMLElement | null;
    const clickedGlassEl = target?.closest<HTMLElement>(this.selector);

    if (clickedGlassEl) {
      const matchedState = this.states.find((s) => s.element === clickedGlassEl);
      if (matchedState) {
        const rect = clickedGlassEl.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        this.addCrack(matchedState, x, y);
      }
    }

    // Also trigger on the global canvas so every click anywhere on the website creates a crack
    if (this.globalState) {
      this.addCrack(this.globalState, clientX, clientY);
    }
  }

  resizeCanvas(state: GlassCrackState) {
    const isGlobal = state.element === document.body;
    const w = isGlobal ? window.innerWidth : state.element.getBoundingClientRect().width;
    const h = isGlobal ? window.innerHeight : state.element.getBoundingClientRect().height;

    state.width = w;
    state.height = h;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    state.canvas.width = w * dpr;
    state.canvas.height = h * dpr;
    state.canvas.style.width = `${w}px`;
    state.canvas.style.height = `${h}px`;

    state.ctx.setTransform(1, 0, 0, 1, 0, 0);
    state.ctx.scale(dpr, dpr);
    this.redraw(state);
  }

  addCrack(state: GlassCrackState, originX: number, originY: number) {
    // Generate an organic tempered glass crack network originating from (originX, originY)
    const newCrackCluster = this.generateCrackCluster(originX, originY, state.width, state.height);
    state.cracks.push(newCrackCluster);

    // Start animation loop if not already running
    if (!state.animationFrameId) {
      this.animate(state);
    }
  }

  generateCrackCluster(
    ox: number,
    oy: number,
    maxWidth: number,
    maxHeight: number
  ): CrackCluster {
    const branches: CrackBranch[] = [];
    const mainBranchesCount = 6 + Math.floor(Math.random() * 4); // 6 to 9 main radial fractures

    for (let i = 0; i < mainBranchesCount; i++) {
      const angle =
        i * ((Math.PI * 2) / mainBranchesCount) + (Math.random() - 0.5) * 0.4;
      const length =
        40 + Math.random() * Math.min(Math.max(maxWidth, maxHeight) * 0.6, 260);
      const segments = this.generateBranchSegments(
        ox,
        oy,
        angle,
        length,
        0,
        maxWidth,
        maxHeight
      );
      branches.push({ segments, progress: 0, speed: 0.08 + Math.random() * 0.04 });
    }

    return {
      ox,
      oy,
      branches,
      opacity: 1.0,
      pulseRadius: 0,
      pulseAlpha: 0.85,
      startTime: performance.now(),
      propagationComplete: false,
    };
  }

  generateBranchSegments(
    startX: number,
    startY: number,
    angle: number,
    targetLength: number,
    depth: number,
    maxWidth: number,
    maxHeight: number
  ): BranchSegment[] {
    const segments: BranchSegment[] = [];
    let currentX = startX;
    let currentY = startY;
    let currentLength = 0;

    const maxSegments = 5 + Math.floor(Math.random() * 5);

    for (let s = 0; s < maxSegments; s++) {
      if (currentLength >= targetLength) break;

      const segmentLength =
        (targetLength / maxSegments) * (0.6 + Math.random() * 0.8);
      // Add jagged deviation to angle
      const jitterAngle = angle + (Math.random() - 0.5) * 0.5;

      const nextX = currentX + Math.cos(jitterAngle) * segmentLength;
      const nextY = currentY + Math.sin(jitterAngle) * segmentLength;

      // Boundary check
      if (nextX < 0 || nextX > maxWidth || nextY < 0 || nextY > maxHeight) break;

      const subBranches: { x1: number; y1: number; x2: number; y2: number }[] = [];
      // Recursively spawn minor secondary branches
      if (depth < 2 && Math.random() > 0.4) {
        const subAngle = jitterAngle + (Math.random() > 0.5 ? 0.7 : -0.7);
        subBranches.push({
          x1: nextX,
          y1: nextY,
          x2: nextX + Math.cos(subAngle) * (segmentLength * 0.5),
          y2: nextY + Math.sin(subAngle) * (segmentLength * 0.5),
        });
      }

      segments.push({
        x1: currentX,
        y1: currentY,
        x2: nextX,
        y2: nextY,
        subBranches,
      });

      currentX = nextX;
      currentY = nextY;
      currentLength += segmentLength;
      angle = jitterAngle; // propagate jagged direction
    }

    return segments;
  }

  animate(state: GlassCrackState) {
    let allCompleted = true;
    const now = performance.now();

    state.ctx.clearRect(0, 0, state.width, state.height);

    for (let i = state.cracks.length - 1; i >= 0; i--) {
      const cluster = state.cracks[i];
      const elapsed = now - cluster.startTime;

      // 1. Animate impact shockwave pulse at origin
      if (cluster.pulseRadius < 32) {
        cluster.pulseRadius += 2.2;
        cluster.pulseAlpha *= 0.91;
        allCompleted = false;
      }

      // 2. Animate crack propagation
      let branchesDone = true;
      cluster.branches.forEach((branch) => {
        if (branch.progress < 1) {
          branch.progress = Math.min(1, branch.progress + branch.speed);
          branchesDone = false;
          allCompleted = false;
        }
      });

      if (branchesDone) {
        cluster.propagationComplete = true;
      }

      // 3. Smooth restoration phase after holding (~900ms hold, ~750ms fade)
      if (elapsed > 900) {
        cluster.opacity -= 0.024;
        if (cluster.opacity > 0) {
          allCompleted = false;
        } else {
          // Cleanly remove completed crack cluster
          state.cracks.splice(i, 1);
          continue;
        }
      } else {
        allCompleted = false;
      }

      this.renderCluster(state.ctx, cluster);
    }

    if (!allCompleted && state.cracks.length > 0) {
      state.animationFrameId = requestAnimationFrame(() => this.animate(state));
    } else {
      state.ctx.clearRect(0, 0, state.width, state.height);
      state.animationFrameId = null;
    }
  }

  renderCluster(ctx: CanvasRenderingContext2D, cluster: CrackCluster) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, cluster.opacity);

    // 1. Render Impact Shock Ring & Micro-fracture center dot
    if (cluster.pulseAlpha > 0.02) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cluster.ox, cluster.oy, cluster.pulseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${cluster.pulseAlpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Specular impact point flash
      ctx.beginPath();
      ctx.arc(cluster.ox, cluster.oy, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${cluster.pulseAlpha * 1.2})`;
      ctx.fill();
      ctx.restore();
    }

    // 2. Render Tempered Glass Crack Lines (Cinematic High-Contrast Vector Styling)
    ctx.save();

    // Outer glow/shadow for depth and realism on glass
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 3;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;

    cluster.branches.forEach((branch) => {
      const totalSegments = branch.segments.length;
      const visibleSegmentsCount = Math.floor(totalSegments * branch.progress);
      const partialFraction = (totalSegments * branch.progress) % 1;

      for (let i = 0; i < totalSegments; i++) {
        const seg = branch.segments[i];
        if (i < visibleSegmentsCount) {
          this.drawCrackLine(ctx, seg.x1, seg.y1, seg.x2, seg.y2);
          // Draw sub-branches if main segment is reached
          seg.subBranches.forEach((sub) => {
            if (branch.progress > 0.6) {
              this.drawCrackLine(ctx, sub.x1, sub.y1, sub.x2, sub.y2, 0.6);
            }
          });
        } else if (i === visibleSegmentsCount && partialFraction > 0) {
          const interpX = seg.x1 + (seg.x2 - seg.x1) * partialFraction;
          const interpY = seg.y1 + (seg.y2 - seg.y1) * partialFraction;
          this.drawCrackLine(ctx, seg.x1, seg.y1, interpX, interpY);
          break;
        }
      }
    });

    ctx.restore();
    ctx.restore();
  }

  drawCrackLine(
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    alphaMultiplier = 1.0
  ) {
    // Tempered glass lines feature a bright specular highlight combined with a sharp dark fracture line

    // Dark sharp core
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = `rgba(15, 20, 30, ${0.85 * alphaMultiplier})`;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Bright crystalline specular highlight
    ctx.beginPath();
    ctx.moveTo(x1 + 0.3, y1 + 0.3);
    ctx.lineTo(x2 + 0.3, y2 + 0.3);
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.9 * alphaMultiplier})`;
    ctx.lineWidth = 0.6;
    ctx.stroke();
  }

  redraw(state: GlassCrackState) {
    state.ctx.clearRect(0, 0, state.width, state.height);
    state.cracks.forEach((cluster) => {
      // Force full progress for static redraws
      cluster.branches.forEach((b) => (b.progress = 1));
      cluster.pulseAlpha = 0;
      this.renderCluster(state.ctx, cluster);
    });
  }

  resetCracks(state: GlassCrackState) {
    if (state.animationFrameId) {
      cancelAnimationFrame(state.animationFrameId);
      state.animationFrameId = null;
    }
    state.cracks = [];
    state.ctx.clearRect(0, 0, state.width, state.height);
  }

  destroy() {
    this.resizeHandlers.forEach((unsub) => unsub());
    this.resizeHandlers = [];

    if (this.dblclickHandler) {
      document.removeEventListener('dblclick', this.dblclickHandler);
      this.dblclickHandler = null;
    }
    if (this.touchHandler) {
      document.removeEventListener('touchstart', this.touchHandler);
      this.touchHandler = null;
    }

    this.states.forEach((state) => {
      this.resetCracks(state);
      state.canvas.remove();
      delete state.element.dataset.glassCrackInitialized;
    });
    this.states = [];

    if (this.globalState) {
      this.resetCracks(this.globalState);
      this.globalState.canvas.remove();
      this.globalState = null;
    }
  }
}

// React wrapper component
export const GlassCrackEffect: React.FC = () => {
  useEffect(() => {
    const system = new GlassCrackSystem(
      '.glass-panel, .crystal-element, [data-glass-crack], .glass-card, [data-glass], .crystal-glass'
    );

    // Expose on window as requested
    (window as unknown as { glassCrackSystem: GlassCrackSystem }).glassCrackSystem =
      system;

    return () => {
      system.destroy();
    };
  }, []);

  return null;
};
