import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ArrowDown, ArrowUpRight, Sparkles, ShieldCheck, Globe } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';
import { SaadSignature } from './SaadSignature';

import designerPortrait from '../assets/images/designer_portrait_1785797201150.jpg';
import designerCutout from '../assets/images/designer_cutout_png_1785843666907.jpg';
import saadCutout from '../assets/images/saad_cutout_png_1785843753308.jpg';
import saadHeadshot from '../assets/images/saad_avatar_headshot_1785846847266.jpg';
import regeneratedCutout from '../assets/images/regenerated_image_1785895097597.png';

interface HeroSectionProps {
  onOpenCms: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenCms }) => {
  // 3D Parallax Tilt for Centered Cutout Image
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 25 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const touch = e.touches[0];
      const x = (touch.clientX - rect.left) / rect.width - 0.5;
      const y = (touch.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x * 1.5);
      mouseY.set(y * 1.5);
    }
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const easing = [0.22, 1, 0.36, 1];

  return (
    <section id="home" className="relative min-h-screen pt-28 pb-0 lg:pb-0 flex flex-col justify-center items-center overflow-hidden bg-[#080808] bg-radial-luxury">
      {/* Background Animated Lines & Red Ambient Breathing Glow */}
      <div className="absolute inset-0 bg-grid-lines pointer-events-none opacity-30" />
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.12, 0.22, 0.12] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[680px] bg-[#D91E2A]/15 rounded-full blur-[160px] pointer-events-none"
      />

      {/* GIANT BACKDROP TEXT: PORTFOLIO */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 0.18, scale: 1 }}
        transition={{ duration: 1.2, ease: easing }}
        className="absolute top-16 sm:top-20 left-1/2 -translate-x-1/2 pointer-events-none select-none z-0 w-full text-center overflow-hidden opacity-18"
      >
        <span className="font-bebas text-[110px] sm:text-[180px] md:text-[230px] lg:text-[270px] font-black tracking-wider text-[#D91E2A] leading-none block uppercase">
          PORTFOLIO
        </span>
      </motion.div>

      <div className="relative max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-16 w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* Left Column: Intro Typography */}
        <div className="lg:col-span-5 flex flex-col items-start pt-6 sm:pt-0">
          {/* Freelance Availability Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easing }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111113] border border-[#D91E2A]/30 mb-6 shadow-[0_0_15px_rgba(217,30,42,0.15)]"
          >
            <span className="w-2 h-2 rounded-full bg-[#D91E2A] animate-ping" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-white uppercase">
              Available for Freelance & Full-Time
            </span>
          </motion.div>

          {/* Hello I'm & Name with Blur Reveal */}
          <div className="mb-2">
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: easing }}
              className="font-serif-luxury italic text-[#D91E2A] text-2xl sm:text-3xl font-light block"
            >
              Hello, I'm
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 40, filter: 'blur(14px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, delay: 0.2, ease: easing }}
              className="font-bebas text-6xl sm:text-8xl lg:text-9xl font-black text-white leading-[0.85] tracking-tight mt-1 mb-3"
            >
              SAAD AHMED
            </motion.h1>
          </div>

          {/* Role Subtitle & Signature */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: easing }}
            className="flex flex-wrap items-center gap-4 mb-6"
          >
            <div className="text-[#D91E2A] font-bold text-xs sm:text-sm tracking-[0.25em] uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D91E2A]" />
              <span>WEB DESIGNER & UI/UX CREATOR</span>
            </div>
            <div className="opacity-80 hover:opacity-100 transition-opacity">
              <SaadSignature className="h-9 w-auto" />
            </div>
          </motion.div>

          {/* Bio Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease: easing }}
            className="font-sans-clean text-sm sm:text-base text-[#9A9A9A] leading-relaxed max-w-md mb-8"
          >
            I design and build stylish, user-focused web experiences that combine creativity with strategy. Passionate about clean design, smooth interactions, and details that make a difference.
          </motion.p>

          {/* Location / Status tag */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: easing }}
            className="flex items-center gap-2 text-xs font-mono text-white/80 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full mb-8"
          >
            <Globe className="w-3.5 h-3.5 text-[#D91E2A]" />
            <span>AVAILABLE WORLDWIDE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[#9A9A9A]">Karachi, PK</span>
          </motion.div>

          {/* Hero CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65, ease: easing }}
            className="flex flex-wrap items-center gap-4"
          >
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.04, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="px-7 py-3.5 rounded-sm bg-[#D91E2A] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#c01823] transition-colors shadow-[0_0_25px_rgba(217,30,42,0.4)] hover:shadow-[0_0_35px_rgba(217,30,42,0.6)] flex items-center gap-2 group"
            >
              <span>View Projects</span>
              <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </motion.a>

            <motion.a
              href="#contact"
              whileHover={{ scale: 1.04, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="px-7 py-3.5 rounded-sm bg-[#111113] border border-white/10 hover:border-white/30 text-white font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-2"
            >
              <span>Contact Me</span>
              <ArrowUpRight className="w-4 h-4 text-[#D91E2A]" />
            </motion.a>
          </motion.div>
        </div>

        {/* Center Column: Seamless Cutout Designer Portrait with 3D Tilt */}
        <div className="lg:col-span-4 flex flex-col justify-end items-center relative z-10 mt-6 lg:mt-0 self-end">
          <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseLeave}
            onTouchCancel={handleMouseLeave}
            whileTap={{ scale: 0.98, rotateX: 5 }}
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: easing }}
            className="relative w-full max-w-[460px] sm:max-w-[560px] lg:max-w-[640px] flex justify-center items-end cursor-pointer perspective-1000 touch-none"
          >
            {/* Seamless Centered Cutout Image - Scaled Up & Clean */}
            <motion.img
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              src={regeneratedCutout}
              alt="Saad Ahmed — UI/UX Designer"
              className="w-full h-auto max-h-[680px] sm:max-h-[780px] lg:max-h-[880px] xl:max-h-[960px] object-contain relative z-10 filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.75)] transition-transform duration-500 mb-0"
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src !== designerCutout) {
                  target.src = designerCutout;
                }
              }}
            />
          </motion.div>
        </div>

        {/* Right Column: Key Metrics & Quote Sparkle */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: easing }}
          className="lg:col-span-3 flex flex-col justify-center space-y-6 z-10"
        >
          {/* Sparkle Tag Card */}
          <motion.div
            whileHover={{ y: -6, scale: 1.02, borderColor: 'rgba(217,30,42,0.5)' }}
            whileTap={{ y: -2, scale: 0.98, borderColor: 'rgba(217,30,42,0.8)' }}
            className="p-5 rounded-2xl bg-[#111113] border border-white/10 relative overflow-hidden transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-2 text-[#D91E2A]">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#9A9A9A]">
                Design Philosophy
              </span>
            </div>
            <p className="text-xs text-white/90 leading-relaxed font-sans-clean">
              Turning complex ideas into powerful, intuitive digital experiences.
            </p>
          </motion.div>

          {/* Big Stacked Stats with Animated Counters */}
          <div className="p-6 rounded-2xl bg-[#111113] border border-white/10 space-y-6">
            <motion.div whileHover={{ x: 4 }} whileTap={{ x: 6, scale: 0.98 }} className="transition-transform cursor-pointer">
              <div className="text-4xl sm:text-5xl font-black font-bebas text-[#D91E2A] tracking-wider leading-none">
                <AnimatedCounter value={3} suffix="+" />
              </div>
              <div className="text-xs font-bold text-white uppercase tracking-wider mt-1">
                YEARS EXPERIENCE
              </div>
              <div className="text-[11px] text-[#9A9A9A] mt-0.5">
                UI/UX, SaaS & Web Systems
              </div>
            </motion.div>

            <motion.div whileHover={{ x: 4 }} whileTap={{ x: 6, scale: 0.98 }} className="pt-4 border-t border-white/[0.08] transition-transform cursor-pointer">
              <div className="text-4xl sm:text-5xl font-black font-bebas text-[#D91E2A] tracking-wider leading-none">
                <AnimatedCounter value={40} suffix="+" />
              </div>
              <div className="text-xs font-bold text-white uppercase tracking-wider mt-1">
                PROJECTS COMPLETED
              </div>
              <div className="text-[11px] text-[#9A9A9A] mt-0.5">
                Websites, Dashboards & Apps
              </div>
            </motion.div>

            <motion.div whileHover={{ x: 4 }} whileTap={{ x: 6, scale: 0.98 }} className="pt-4 border-t border-white/[0.08] transition-transform cursor-pointer">
              <div className="text-4xl sm:text-5xl font-black font-bebas text-[#D91E2A] tracking-wider leading-none">
                <AnimatedCounter value={100} suffix="%" />
              </div>
              <div className="text-xs font-bold text-white uppercase tracking-wider mt-1">
                HAPPY CLIENTS
              </div>
              <div className="text-[11px] text-[#9A9A9A] mt-0.5">
                Global Freelance & Enterprise
              </div>
            </motion.div>
          </div>

        </motion.div>

      </div>
    </section>
  );
};

