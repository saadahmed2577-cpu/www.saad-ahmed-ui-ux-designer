import React from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { ArrowDown, ArrowUpRight, Sparkles } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';
import { SaadSignature } from './SaadSignature';
import { HeroSpotlightPortrait } from './HeroSpotlightPortrait';

interface HeroSectionProps {
  onOpenCms: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenCms }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-300, 300], [8, -8]);
  const rotateY = useTransform(mouseX, [-300, 300], [-8, 8]);

  const handleSectionMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const easing = [0.22, 1, 0.36, 1];

  return (
    <section 
      id="home" 
      onMouseMove={handleSectionMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen pt-28 pb-16 flex flex-col justify-between items-center overflow-hidden bg-[#080808] bg-radial-luxury"
    >
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

      {/* Main Top Two Columns: Intro Text (Left) & Portrait (Right/Center) */}
      <div className="relative max-w-[1700px] mx-auto px-6 sm:px-12 lg:px-16 w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-end flex-1">
        
        {/* Left Column: Intro Typography */}
        <div className="lg:col-span-5 xl:col-span-5 flex flex-col items-start pt-6 sm:pt-0 pb-6 lg:pb-12 z-20">
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

          {/* Designer Name & Roles */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: easing }}
            className="font-bebas text-6xl sm:text-7xl lg:text-8xl tracking-tight leading-[0.9] text-white uppercase mb-4"
          >
            SAAD <span className="text-[#D91E2A]">AHMED</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: easing }}
            className="flex items-center gap-3 text-sm sm:text-base font-mono tracking-widest text-[#9A9A9A] uppercase mb-6"
          >
            <span className="text-white font-semibold">Senior UI/UX Designer</span>
            <span className="text-[#D91E2A]">•</span>
            <span>Design Engineer</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: easing }}
            className="text-base sm:text-lg text-[#9A9A9A] max-w-xl font-light leading-relaxed mb-8 font-sans-clean"
          >
            Crafting precise digital systems, high-conversion interfaces, and scalable component architectures with a luxury-tech dark aesthetic.
          </motion.p>

          {/* CTA Action Buttons & Signature */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: easing }}
            className="flex flex-wrap items-center gap-4 w-full sm:w-auto"
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

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-8"
          >
            <SaadSignature className="w-32 h-auto text-white/50 hover:text-white transition-colors" />
          </motion.div>
        </div>

        {/* Right Column: Hero Spotlight Reveal Portrait */}
        <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-end items-center lg:items-end relative z-10 mt-6 lg:mt-0 self-end overflow-visible">
          <HeroSpotlightPortrait rotateX={rotateX} rotateY={rotateY} />
        </div>

      </div>

      {/* Bottom Horizontal Row: Design Philosophy + Stats in a clean line */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: easing }}
        className="relative max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-16 w-full z-20 mt-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Card 1: Design Philosophy */}
          <motion.div
            whileHover={{ y: -4, borderColor: 'rgba(217,30,42,0.5)' }}
            whileTap={{ y: -2, scale: 0.98 }}
            data-glass="true"
            className="glass-card crystal-glass p-5 rounded-2xl border border-white/10 relative overflow-hidden transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-[#D91E2A]">
                <Sparkles className="w-4 h-4 animate-spin-slow" />
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#9A9A9A]">
                  Design Philosophy
                </span>
              </div>
              <span className="text-[9px] font-mono tracking-wider text-white/50 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full group-hover:text-white/80 transition-colors">
                Crystal Glass
              </span>
            </div>
            <p className="text-xs text-white/90 leading-relaxed font-sans-clean">
              Turning complex ideas into powerful, intuitive digital experiences.
            </p>
          </motion.div>

          {/* Card 2: Years Experience */}
          <motion.div
            whileHover={{ y: -4, borderColor: 'rgba(217,30,42,0.5)' }}
            whileTap={{ y: -2, scale: 0.98 }}
            data-glass="true"
            className="glass-card crystal-glass p-5 rounded-2xl border border-white/10 relative overflow-hidden transition-all cursor-pointer group"
          >
            <div className="text-4xl sm:text-5xl font-black font-bebas text-[#D91E2A] tracking-wider leading-none">
              <AnimatedCounter value={3} suffix="+" />
            </div>
            <div className="text-xs font-bold text-white uppercase tracking-wider mt-2">
              YEARS EXPERIENCE
            </div>
            <div className="text-[11px] text-[#9A9A9A] mt-0.5">
              UI/UX, SaaS & Web Systems
            </div>
          </motion.div>

          {/* Card 3: Projects Completed */}
          <motion.div
            whileHover={{ y: -4, borderColor: 'rgba(217,30,42,0.5)' }}
            whileTap={{ y: -2, scale: 0.98 }}
            data-glass="true"
            className="glass-card crystal-glass p-5 rounded-2xl border border-white/10 relative overflow-hidden transition-all cursor-pointer group"
          >
            <div className="text-4xl sm:text-5xl font-black font-bebas text-[#D91E2A] tracking-wider leading-none">
              <AnimatedCounter value={40} suffix="+" />
            </div>
            <div className="text-xs font-bold text-white uppercase tracking-wider mt-2">
              PROJECTS COMPLETED
            </div>
            <div className="text-[11px] text-[#9A9A9A] mt-0.5">
              Websites, Dashboards & Apps
            </div>
          </motion.div>

          {/* Card 4: Happy Clients */}
          <motion.div
            whileHover={{ y: -4, borderColor: 'rgba(217,30,42,0.5)' }}
            whileTap={{ y: -2, scale: 0.98 }}
            data-glass="true"
            className="glass-card crystal-glass p-5 rounded-2xl border border-white/10 relative overflow-hidden transition-all cursor-pointer group"
          >
            <div className="text-4xl sm:text-5xl font-black font-bebas text-[#D91E2A] tracking-wider leading-none">
              <AnimatedCounter value={100} suffix="%" />
            </div>
            <div className="text-xs font-bold text-white uppercase tracking-wider mt-2">
              HAPPY CLIENTS
            </div>
            <div className="text-[11px] text-[#9A9A9A] mt-0.5">
              Global Freelance & Enterprise
            </div>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
};
