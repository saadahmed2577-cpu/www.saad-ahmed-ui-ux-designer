import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DESIGN_PROCESS_STEPS } from '../data/initialData';
import { Search, Layout, Palette, MousePointer, CheckCircle, Send, ArrowDown } from 'lucide-react';

export const DesignProcessSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const icons = [Search, Layout, Palette, MousePointer, CheckCircle, Send];
  const easing = [0.22, 1, 0.36, 1];

  return (
    <section id="process" className="py-24 relative bg-[#080808] border-t border-white/[0.08] overflow-hidden">
      <div className="max-w-[1600px] w-full mx-auto px-6 sm:px-12 lg:px-16">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: easing }}
          className="flex flex-col items-center text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111113] border border-[#D91E2A]/30 mb-4">
            <span className="text-[10px] font-mono tracking-widest text-[#D91E2A] font-bold uppercase">
              METHODOLOGY & WORKFLOW
            </span>
          </div>
          <h2 className="font-bebas text-4xl sm:text-6xl font-bold tracking-tight text-white mb-2 uppercase">
            Human-Centered <span className="font-serif-luxury italic font-normal text-[#D91E2A] capitalize text-3xl sm:text-5xl">Design Process</span>
          </h2>
          <p className="font-sans-clean text-xs sm:text-sm text-[#9A9A9A] max-w-xl leading-relaxed">
            A structured, repeatable framework that transforms complex product visions into high-impact digital experiences.
          </p>
        </motion.div>

        {/* Desktop / Mobile Sequential Workflow Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 relative mb-12">
          {DESIGN_PROCESS_STEPS.map((stepItem, idx) => {
            const IconComponent = icons[idx] || Search;
            const isSelected = activeStep === idx;

            return (
              <motion.div
                key={stepItem.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: easing }}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ y: -3, scale: 0.97 }}
                onClick={() => setActiveStep(idx)}
                className={`glass-card p-6 rounded-2xl cursor-pointer transition-all duration-300 relative group flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#D91E2A] bg-[#161214] shadow-[0_0_25px_rgba(217,30,42,0.25)]'
                    : 'hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bebas text-3xl font-bold text-[#D91E2A]">
                      {stepItem.step}
                    </span>
                    <div className={`p-2 rounded-xl transition-colors ${
                      isSelected ? 'bg-[#D91E2A] text-white' : 'bg-white/5 text-[#9A9A9A] group-hover:text-white'
                    }`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1 uppercase tracking-wide">
                    {stepItem.title}
                  </h3>
                  <div className="text-[11px] font-mono text-[#9A9A9A] mb-3">
                    {stepItem.subtitle}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Selected Step Active Details Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: easing }}
            className="glass-card p-8 sm:p-10 rounded-2xl border border-[#D91E2A]/40 bg-[#111113] relative overflow-hidden"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 pb-6 border-b border-white/[0.08]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#D91E2A] text-white flex items-center justify-center font-bebas text-2xl font-bold shadow-[0_0_15px_rgba(217,30,42,0.4)]">
                  {DESIGN_PROCESS_STEPS[activeStep].step}
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-white">
                    Phase {DESIGN_PROCESS_STEPS[activeStep].step}: {DESIGN_PROCESS_STEPS[activeStep].title}
                  </h4>
                  <p className="text-xs font-mono text-[#D91E2A] font-bold uppercase mt-0.5">
                    {DESIGN_PROCESS_STEPS[activeStep].subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#9A9A9A] font-mono font-bold">Phase 0{activeStep + 1} of 06</span>
              </div>
            </div>

            <p className="font-sans-clean text-sm sm:text-base text-[#FFFFFF]/90 leading-relaxed max-w-3xl">
              {DESIGN_PROCESS_STEPS[activeStep].description}
            </p>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};

