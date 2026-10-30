import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { EffectCards, Autoplay, Navigation } from 'swiper/modules';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Sparkles, Layers, ArrowRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/navigation';

interface ProcessSlide {
  code: string;
  step: string;
  title: string;
  subtitle: string;
  description: string;
  src: string;
  alt: string;
  deliverables: string[];
}

const PROCESS_SLIDES: ProcessSlide[] = [
  {
    code: 'PHASE_01 // DISCOVER',
    step: '01',
    title: 'Research & Discovery',
    subtitle: 'Understanding Users & Context',
    description: 'Uncovering core user needs, competitive analysis, persona mapping, and business goal alignment to establish an airtight product foundation.',
    src: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=900&q=80',
    alt: 'UX Research and Sticky Notes Wall',
    deliverables: ['User Personas', 'Journey Mapping', 'Competitive Matrix']
  },
  {
    code: 'PHASE_02 // ARCHITECTURE',
    step: '02',
    title: 'Wireframing & IA',
    subtitle: 'Architecture & User Flow',
    description: 'Translating research insights into low-fidelity structural layouts, site maps, and frictionless user journeys with zero distraction.',
    src: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=900&q=80',
    alt: 'Wireframing layout sketch & digital blueprint',
    deliverables: ['Low-Fi Wireframes', 'Information Architecture', 'User Flows']
  },
  {
    code: 'PHASE_03 // VISUAL CRAFT',
    step: '03',
    title: 'UI Design & Systems',
    subtitle: 'High-Fidelity Aesthetics',
    description: 'Crafting pixel-perfect interfaces with luxury dark aesthetics, crisp typography, custom iconsets, and systematic Figma component libraries.',
    src: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=900&q=80',
    alt: 'Design screens & Figma creative system',
    deliverables: ['Design System', 'Typography Scale', 'High-Fidelity Screens']
  },
  {
    code: 'PHASE_04 // INTERACTION',
    step: '04',
    title: 'Interactive Prototyping',
    subtitle: 'Micro-Interactions & Motion',
    description: 'Building dynamic interactive prototypes to simulate micro-interactions, page transitions, and tactile feel before writing a single line of code.',
    src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
    alt: 'Digital dashboard interactive prototype',
    deliverables: ['Clickable Prototype', 'Motion Choreography', 'Haptic Specs']
  },
  {
    code: 'PHASE_05 // VALIDATION',
    step: '05',
    title: 'Testing & Auditing',
    subtitle: 'Usability & Accessibility Audits',
    description: 'Conducting real-world user testing, collecting rigorous feedback loops, and ensuring WCAG AA accessibility compliance across devices.',
    src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80',
    alt: 'User testing and collaboration review',
    deliverables: ['Usability Scorecard', 'A/B Test Results', 'WCAG AA Audit']
  },
  {
    code: 'PHASE_06 // SHIP & SCALE',
    step: '06',
    title: 'Final Delivery & Handoff',
    subtitle: 'Developer Handoff & CMS Specs',
    description: 'Preparing pixel-precise design token handoffs, asset exports, responsive guidelines, and Webflow or CMS publishing configurations.',
    src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
    alt: 'Analytics and digital launch product handoff',
    deliverables: ['Design Token Specs', 'Dev Handoff File', 'CMS Setup Guide']
  }
];

export const DesignProcessSection: React.FC = () => {
  const [active, setActive] = useState<number>(0);
  const swiperRef = useRef<SwiperType | null>(null);

  const activeSlide = PROCESS_SLIDES[active] || PROCESS_SLIDES[0];

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  return (
    <section id="process" className="py-24 px-4 sm:px-8 bg-[#080808] border-t border-white/[0.08] relative overflow-hidden flex flex-col items-center">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D91E2A]/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-6xl w-full mx-auto relative z-10 flex flex-col items-center">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111113] border border-[#D91E2A]/30 mb-4 shadow-[0_0_15px_rgba(217,30,42,0.15)]">
            <Sparkles className="w-3.5 h-3.5 text-[#D91E2A]" />
            <span className="text-[10px] font-mono tracking-widest text-[#D91E2A] font-bold uppercase">
              METHODOLOGY & WORKFLOW
            </span>
          </div>

          <h2 className="font-bebas text-4xl sm:text-6xl font-bold tracking-tight text-white mb-3 uppercase">
            Human-Centered <span className="font-serif-luxury italic font-normal text-[#D91E2A] capitalize text-3xl sm:text-5xl">Design Process</span>
          </h2>

          <p className="font-sans-clean text-xs sm:text-sm text-[#9A9A9A] max-w-xl leading-relaxed">
            Swipe or drag through each phase of my structured, repeatable framework that transforms complex product visions into high-impact digital experiences.
          </p>
        </motion.div>

        {/* 3D Perspective Cards Carousel Container */}
        <div className="w-full flex flex-col items-center mb-10">
          <div className="w-[280px] h-[400px] sm:w-[320px] sm:h-[450px] md:w-[360px] md:h-[480px] relative select-none">
            <Swiper
              effect="cards"
              grabCursor={true}
              loop={true}
              autoplay={{
                delay: 3500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
              }}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              onSlideChange={(s) => setActive(s.realIndex)}
              modules={[EffectCards, Autoplay, Navigation]}
              className="size-full overflow-visible"
            >
              {PROCESS_SLIDES.map((slide, i) => (
                <SwiperSlide
                  key={i}
                  className="rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/20 bg-stone-900 group cursor-grab active:cursor-grabbing"
                >
                  <img
                    src={slide.src}
                    alt={slide.alt}
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Top Phase Tag Badge */}
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-mono font-bold text-white tracking-widest">
                      PHASE {slide.step}
                    </span>
                  </div>

                  {/* Gradient Card Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-6 sm:p-7 text-white">
                    <span className="font-mono text-[#D91E2A] text-xs font-bold tracking-wider mb-1.5 uppercase">
                      {slide.code}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bebas tracking-wide text-white mb-1">
                      {slide.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/70 line-clamp-2 font-sans-clean leading-relaxed">
                      {slide.subtitle}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Carousel Controls & Pagination Dots */}
          <div className="flex items-center gap-4 mt-8">
            <button
              onClick={handlePrev}
              aria-label="Previous step"
              className="p-3 rounded-full bg-[#121214] border border-white/10 hover:border-[#D91E2A] text-[#9A9A9A] hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#121214] border border-white/10">
              {PROCESS_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => swiperRef.current?.slideToLoop(idx)}
                  aria-label={`Jump to step ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    active === idx
                      ? 'w-7 bg-[#D91E2A] shadow-[0_0_10px_rgba(217,30,42,0.8)]'
                      : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              aria-label="Next step"
              className="p-3 rounded-full bg-[#121214] border border-white/10 hover:border-[#D91E2A] text-[#9A9A9A] hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Detail Card for Active Slide */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-3xl glass-card p-6 sm:p-8 rounded-2xl border border-[#D91E2A]/30 bg-[#111113]/90 backdrop-blur-md shadow-2xl relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08] mb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-[#D91E2A] text-white flex items-center justify-center font-bebas text-2xl font-bold shadow-[0_0_15px_rgba(217,30,42,0.4)]">
                  {activeSlide.step}
                </div>
                <div>
                  <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Phase {activeSlide.step}: {activeSlide.title}
                  </h4>
                  <p className="text-xs font-mono text-[#D91E2A] font-bold uppercase tracking-wider">
                    {activeSlide.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 self-start sm:self-auto px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <Layers className="w-3.5 h-3.5 text-[#9A9A9A]" />
                <span className="text-[11px] font-mono text-[#9A9A9A] font-semibold">
                  Step 0{active + 1} of 06
                </span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-white/90 leading-relaxed mb-6 font-sans-clean">
              {activeSlide.description}
            </p>

            {/* Deliverables / Artifacts */}
            <div>
              <span className="text-[10px] font-mono text-[#9A9A9A] tracking-wider uppercase font-bold block mb-2">
                Core Deliverables
              </span>
              <div className="flex flex-wrap gap-2">
                {activeSlide.deliverables.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-white/80 font-sans-clean"
                  >
                    <ArrowRight className="w-3 h-3 text-[#D91E2A]" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
