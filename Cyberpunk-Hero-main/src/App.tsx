/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';

const BG_IMAGE_1 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_125121_afb71ce9-9c64-4c54-90b5-c89c0764c052.png&w=1920&q=85';

const BG_IMAGE_2 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_135737_0da59642-725b-451a-997b-b0283d95a42a.png&w=1280&q=85';

const NAV_LINKS = [
  { label: 'Module', active: true },
  { label: 'Case Records', active: false },
  { label: 'Biotech', active: false },
  { label: 'Tiers', active: false },
  { label: 'Live Demo', active: false },
];

const ARC_STATS = [
  {
    r: 330,
    startAngle: -92,
    endAngle: 16,
    dotAngle: -46,
    len: 622.03,
    x1: -121.52,
    y1: -29.8,
    x2: 207.22,
    y2: 390.96,
    dotX: 119.24,
    dotY: 62.62,
    statNumber: '10',
    statSuffix: '+',
    statLabel: 'YEARS REAL',
  },
  {
    r: 395,
    startAngle: -56,
    endAngle: 60,
    dotAngle: 2,
    len: 799.71,
    x1: 110.88,
    y1: -27.47,
    x2: 87.5,
    y2: 642.08,
    dotX: 284.76,
    dotY: 313.79,
    statNumber: '40',
    statSuffix: '+',
    statLabel: 'USE FORMS',
  },
  {
    r: 460,
    startAngle: -14,
    endAngle: 72,
    dotAngle: 44,
    len: 690.45,
    x1: 336.34,
    y1: 188.72,
    x2: 32.15,
    y2: 737.49,
    dotX: 220.9,
    dotY: 619.54,
    statNumber: '95',
    statSuffix: '%',
    statLabel: 'REPEAT MEMBERS',
  },
];

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

    const offscreenCanvas = document.createElement('canvas');
    const offscreenCtx = offscreenCanvas.getContext('2d');

    const updateCanvasDimensions = () => {
      offscreenCanvas.width = window.innerWidth;
      offscreenCanvas.height = window.innerHeight;
    };

    updateCanvasDimensions();
    window.addEventListener('resize', updateCanvasDimensions);

    const handleMouseMove = (e: MouseEvent) => {
      hasInteracted = true;
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
      normX = e.clientX / window.innerWidth;
      normY = e.clientY / window.innerHeight;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        hasInteracted = true;
        targetMouseX = e.touches[0].clientX;
        targetMouseY = e.touches[0].clientY;
        normX = e.touches[0].clientX / window.innerWidth;
        normY = e.touches[0].clientY / window.innerHeight;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    const renderLoop = () => {
      // Lerp mouse cursor for reveal spotlight
      if (hasInteracted) {
        currMouseX += (targetMouseX - currMouseX) * 0.1;
        currMouseY += (targetMouseY - currMouseY) * 0.1;
      }

      // Lerp grid parallax
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
    <div
      id="app-root"
      className="min-h-screen bg-black text-white tracking-[-0.02em] select-none overflow-hidden"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      {/* Fixed Navbar (z-[60]) */}
      <nav
        id="navbar"
        className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between md:justify-center p-4 sm:p-5 pointer-events-none"
      >
        {/* Desktop View: Centered Atmospheric Pill */}
        <div
          id="desktop-nav-pill"
          className="hidden md:flex nav-drop bg-black/60 backdrop-blur-md rounded-full pl-3 pr-2 py-2 items-center gap-1 shadow-2xl border border-white/10 pointer-events-auto"
        >
          {/* Logo Mark */}
          <div id="desktop-logo" className="w-[22px] h-[22px] flex items-center justify-center mr-1.5 shrink-0">
            <svg
              viewBox="0 0 256 256"
              className="w-[22px] h-[22px] fill-white"
              aria-label="Augmented System Logo"
            >
              <path d="M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 96 95 L 63.5 128 L 64 128 L 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 64 L 64 0 L 192 0 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z" />
            </svg>
          </div>

          {/* Links */}
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              id={`nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
              type="button"
              className={`text-sm font-medium px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                link.active
                  ? 'text-white bg-white/10 shadow-inner'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}

          {/* CTA */}
          <button
            id="desktop-nav-connect"
            type="button"
            className="bg-white text-gray-900 text-sm font-semibold px-5 py-1.5 rounded-full hover:bg-gray-100 ml-1 transition-all duration-200 cursor-pointer"
          >
            Connect
          </button>
        </div>

        {/* Mobile View: Logo Pill Left & Menu Toggle Pill Right */}
        <div className="flex md:hidden items-center justify-between w-full pointer-events-auto">
          {/* Mobile Logo Pill */}
          <div
            id="mobile-logo-pill"
            className="nav-drop bg-black/60 backdrop-blur-md rounded-full p-2.5 flex items-center justify-center border border-white/10"
          >
            <svg
              viewBox="0 0 256 256"
              className="w-[22px] h-[22px] fill-white"
              aria-label="Augmented System Logo"
            >
              <path d="M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 96 95 L 63.5 128 L 64 128 L 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 64 L 64 0 L 192 0 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z" />
            </svg>
          </div>

          {/* Mobile Hamburger Toggle Pill */}
          <button
            id="mobile-menu-toggle"
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="nav-drop bg-black/60 backdrop-blur-md rounded-full p-2.5 text-white flex items-center justify-center border border-white/10 cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu (z-40) */}
      {mobileMenuOpen && (
        <div
          id="mobile-dropdown-menu"
          className="fixed top-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-xl pt-20 pb-8 px-6 shadow-2xl border-b border-white/10 flex flex-col md:hidden animate-in fade-in slide-in-from-top-4 duration-200"
        >
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-3.5 border-b border-white/5 text-left text-sm font-medium transition-colors ${
                link.active ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            id="mobile-nav-connect"
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full mt-6 bg-white text-gray-950 text-sm font-semibold py-3.5 rounded-full text-center hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Connect
          </button>
        </div>
      )}

      {/* Hero Section (100dvh, relative overflow-hidden) */}
      <section id="hero-section" className="relative h-[100dvh] w-full overflow-hidden bg-black">
        {/* Layer 1: Atmospheric Grid Background (z-10) with Parallax */}
        <div
          ref={gridContainerRef}
          className="absolute -inset-4 z-10 pointer-events-none opacity-15"
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

        {/* Layer 4: Stats on Fading Circular Arc (z-50, hidden below sm) */}
        <div
          id="stats-arcs-container"
          className="absolute inset-y-0 right-0 pointer-events-none hidden sm:block z-50 w-full max-w-[420px] md:max-w-[480px] lg:max-w-[540px] xl:max-w-[580px] overflow-visible"
        >
          <svg
            viewBox="0 0 380 700"
            preserveAspectRatio="xMaxYMid meet"
            className="h-full w-full overflow-visible"
            aria-label="System Metrics and Statistics"
          >
            <defs>
              {ARC_STATS.map((stat, i) => (
                <linearGradient
                  key={`arc-grad-${i}`}
                  id={`arc-gradient-${i}`}
                  gradientUnits="userSpaceOnUse"
                  x1={stat.x1}
                  y1={stat.y1}
                  x2={stat.x2}
                  y2={stat.y2}
                >
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                  <stop offset="22%" stopColor="#ffffff" stopOpacity="0.5" />
                  <stop offset="55%" stopColor="#ffffff" stopOpacity="0.5" />
                  <stop offset="85%" stopColor="#ffffff" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
              ))}
            </defs>

            {ARC_STATS.map((stat, i) => {
              const lineDelay = 0.4 + i * 0.22;
              const markDelay = lineDelay + 0.9;
              const ringDelay = markDelay + 0.3;
              const numberDelay = markDelay + 0.15;
              const labelDelay = markDelay + 0.3;

              return (
                <g key={`arc-group-${i}`}>
                  {/* Arc Path */}
                  <path
                    d={`M ${stat.x1} ${stat.y1} A ${stat.r} ${stat.r} 0 0 1 ${stat.x2} ${stat.y2}`}
                    fill="none"
                    stroke={`url(#arc-gradient-${i})`}
                    strokeWidth="1.1"
                    className="arc-line"
                    style={
                      {
                        '--len': `${stat.len}px`,
                        animationDelay: `${lineDelay}s`,
                      } as React.CSSProperties
                    }
                  />

                  {/* Arc Pulsing Ring */}
                  <circle
                    cx={stat.dotX}
                    cy={stat.dotY}
                    r={7}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="1"
                    className="arc-ring"
                    style={{
                      animationDelay: `${ringDelay}s`,
                    }}
                  />

                  {/* Arc PopIn Dot */}
                  <circle
                    cx={stat.dotX}
                    cy={stat.dotY}
                    r={3.4}
                    fill="#ffffff"
                    className="arc-dot"
                    style={{
                      animationDelay: `${markDelay}s`,
                    }}
                  />

                  {/* Stat Number */}
                  <text
                    x={stat.dotX + 16}
                    y={stat.dotY + 4}
                    fill="#ffffff"
                    fontSize="32"
                    fontWeight="700"
                    letterSpacing="-1"
                    className="arc-text font-helvetica-neue"
                    style={{
                      animationDelay: `${numberDelay}s`,
                    }}
                  >
                    {stat.statNumber}
                    <tspan dy="-10" fontSize="19" fontWeight="700">
                      {stat.statSuffix}
                    </tspan>
                  </text>

                  {/* Stat Label */}
                  <text
                    x={stat.dotX + 18}
                    y={stat.dotY + 22}
                    fill="#ffffff"
                    fillOpacity="0.8"
                    fontSize="8.5"
                    fontWeight="600"
                    letterSpacing="2"
                    className="arc-text font-helvetica-neue"
                    style={{
                      animationDelay: `${labelDelay}s`,
                    }}
                  >
                    {stat.statLabel}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Layer 5: Atmospheric Hero Text Block (z-50) */}
        <div
          id="hero-text-block"
          className="absolute bottom-12 sm:bottom-16 md:bottom-24 left-5 sm:left-8 md:left-12 max-w-[320px] sm:max-w-[440px] z-50 flex flex-col"
        >
          {/* Eyebrow */}
          <div
            id="hero-eyebrow"
            className="hero-rise text-[11px] font-semibold tracking-[0.12em] text-white/90 uppercase mb-3"
            style={{ animationDelay: '0.15s' }}
          >
            Gateway to your <em className="italic font-normal">augmented self</em>
          </div>

          {/* H1 Display Headline */}
          <h1
            id="hero-heading"
            className="hero-rise text-4xl sm:text-5xl md:text-[56px] leading-[1.05] tracking-[-0.08em] font-normal text-white mb-6"
            style={{ animationDelay: '0.3s' }}
          >
            A window
            <br />
            of coming
            <br />
            enhancements
          </h1>

          {/* Paragraph Description */}
          <p
            id="hero-description"
            className="hero-rise text-sm sm:text-[15px] leading-[1.6] text-white/80 mb-8 font-normal"
            style={{ animationDelay: '0.5s' }}
          >
            A future where carbon fiber, titanium, and human instinct align. Not machine. Not
            human. Something wonderfully poised between.
          </p>

          {/* CTA Button */}
          <div
            id="hero-cta-container"
            className="hero-rise"
            style={{ animationDelay: '0.7s' }}
          >
            <button
              id="hero-reserve-button"
              type="button"
              className="group relative overflow-hidden inline-flex items-center justify-center bg-white text-black font-semibold text-sm sm:text-base px-8 py-3.5 rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.2)] transition-transform duration-200 hover:scale-[1.04] active:scale-95 cursor-pointer"
            >
              <span className="relative z-10">Reserve Now</span>
              {/* Atmospheric Shine Sweep on Hover */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
