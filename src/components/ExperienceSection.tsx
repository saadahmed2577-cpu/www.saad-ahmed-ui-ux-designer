import React from 'react';
import { motion } from 'motion/react';
import { EXPERIENCE_TIMELINE } from '../data/initialData';
import { Calendar, CheckCircle2, Award, Quote, Search, Lightbulb, PenTool, Code, Send, ArrowUpRight } from 'lucide-react';

export const ExperienceSection: React.FC = () => {
  const educationItems = [
    {
      degree: 'Intermediate (Higher Secondary Education)',
      institution: 'Karachi, Pakistan',
      period: '2016 — 2019',
    },
    {
      degree: 'Matriculation',
      institution: 'Board of Secondary Education Karachi',
      period: 'Completed',
    },
    {
      degree: 'UI/UX Design Course',
      institution: 'Arena Multimedia',
      period: '2019 — 2022',
    },
    {
      degree: 'CIT Diploma',
      institution: 'INFO Channel Pakistan',
      period: 'Diploma Certified',
    }
  ];

  const skillPills = [
    'UI/UX DESIGN (75%)', 'FIGMA (80%)', 'ADOBE PHOTOSHOP (90%)',
    'WEB DESIGNING', 'PHOTO EDITING', 'FLYER DESIGN', 'MOCK-UPS'
  ];

  const processSteps = [
    {
      num: '01',
      title: 'DISCOVER',
      icon: Search,
      desc: 'Understanding goals, audience, and project requirements.'
    },
    {
      num: '02',
      title: 'IDEATE',
      icon: Lightbulb,
      desc: 'Planning, wireframing, and creating the right concept.'
    },
    {
      num: '03',
      title: 'DESIGN',
      icon: PenTool,
      desc: 'Crafting visual design with a focus on user experience.'
    },
    {
      num: '04',
      title: 'DEVELOP',
      icon: Code,
      desc: 'Building fast, responsive, and high-performing websites.'
    },
    {
      num: '05',
      title: 'DELIVER',
      icon: Send,
      desc: 'Testing, optimizing, and launching with perfection.'
    }
  ];

  const easing = [0.22, 1, 0.36, 1];

  return (
    <section id="experience" className="py-24 relative bg-[#080808] border-t border-white/[0.08] overflow-hidden">
      <div className="max-w-[1600px] w-full mx-auto px-6 sm:px-12 lg:px-16">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: easing }}
          className="flex flex-col items-start mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111113] border border-[#D91E2A]/30 mb-4">
            <span className="text-[10px] font-mono tracking-widest text-[#D91E2A] font-bold uppercase">
              03 // EXPERIENCE, SKILLS & WORKFLOW
            </span>
          </div>
          <h2 className="font-bebas text-4xl sm:text-6xl font-bold tracking-tight text-white leading-none uppercase">
            Professional <span className="font-serif-luxury italic font-normal text-[#D91E2A] capitalize text-3xl sm:text-5xl">Career Journey</span>
          </h2>
        </motion.div>

        {/* TOP ROW: EXPERIENCE TIMELINE */}
        <div className="space-y-6 mb-20">
          <h3 className="text-xs font-bold tracking-[0.25em] text-[#D91E2A] uppercase mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D91E2A]" />
            <span>WORK EXPERIENCE</span>
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {EXPERIENCE_TIMELINE.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.7, delay: index * 0.15, ease: easing }}
                whileHover={{ y: -8, scale: 1.015, borderColor: 'rgba(217,30,42,0.6)' }}
                whileTap={{ y: -3, scale: 0.98, borderColor: 'rgba(217,30,42,0.8)' }}
                className="glass-card p-6 sm:p-8 rounded-2xl border border-white/10 transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-xs font-mono tracking-wider text-[#D91E2A] font-bold uppercase">
                      {item.company}
                    </span>
                    <span className="text-[10px] font-mono bg-[#D91E2A]/10 text-[#D91E2A] border border-[#D91E2A]/20 px-2.5 py-0.5 rounded-full font-bold">
                      {item.period}
                    </span>
                  </div>

                  <h4 className="text-xl font-bold text-white mb-3">
                    {item.role}
                  </h4>

                  <p className="font-sans-clean text-xs text-[#9A9A9A] leading-relaxed mb-6 line-clamp-4">
                    {item.description}
                  </p>
                </div>

                {item.achievements && (
                  <div className="pt-4 border-t border-white/[0.08] space-y-2">
                    {item.achievements.slice(0, 2).map((ach, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-[11px] text-white/90">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#D91E2A] shrink-0 mt-0.5" />
                        <span>{ach}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* BOTTOM THREE-COLUMN GRID: EDUCATION & SKILLS | WORK PROCESS | VELVET RED QUOTE CARD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-white/[0.08]">
          
          {/* Column 1: EDUCATION & CERTIFICATIONS */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, ease: easing }}
            className="lg:col-span-4 space-y-8"
          >
            {/* Education Block */}
            <div>
              <h3 className="text-xs font-bold tracking-[0.2em] text-[#D91E2A] uppercase mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D91E2A]" />
                <span>EDUCATION & CERTIFICATIONS</span>
              </h3>

              <div className="space-y-4">
                {educationItems.map((edu, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ x: 4, borderColor: 'rgba(217,30,42,0.4)' }}
                    whileTap={{ x: 6, scale: 0.98, borderColor: 'rgba(217,30,42,0.7)' }}
                    className="p-4 rounded-xl bg-[#111113] border border-white/10 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#9A9A9A] mb-1">
                      <span>{edu.institution}</span>
                      <span className="text-[#D91E2A] font-bold">{edu.period}</span>
                    </div>
                    <div className="text-sm font-bold text-white">
                      {edu.degree}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Skills Grid Pills */}
            <div>
              <h3 className="text-xs font-bold tracking-[0.2em] text-[#D91E2A] uppercase mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D91E2A]" />
                <span>CORE SKILLS & TOOLS</span>
              </h3>

              <div className="flex flex-wrap gap-2">
                {skillPills.map((skill, idx) => (
                  <motion.span
                    key={skill}
                    whileHover={{ scale: 1.08, y: -2, backgroundColor: '#1A1A1E', borderColor: 'rgba(217,30,42,0.8)' }}
                    whileTap={{ scale: 0.95, y: -1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="px-3 py-2 rounded-lg bg-[#111113] border border-white/10 text-[11px] font-mono font-bold text-[#9A9A9A] hover:text-white transition-colors cursor-pointer"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Column 2: WORK PROCESS */}
          <motion.div
            id="process"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, delay: 0.2, ease: easing }}
            className="lg:col-span-4 space-y-6"
          >
            <h3 className="text-xs font-bold tracking-[0.2em] text-[#D91E2A] uppercase mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D91E2A]" />
              <span>WORK PROCESS</span>
            </h3>

            <div className="space-y-4">
              {processSteps.map((step, idx) => {
                const IconComp = step.icon;
                return (
                  <motion.div
                    key={step.num}
                    whileHover={{ x: 6, borderColor: 'rgba(217,30,42,0.5)' }}
                    whileTap={{ x: 8, scale: 0.98, borderColor: 'rgba(217,30,42,0.8)' }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-[#111113] border border-white/10 transition-colors group cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#080808] border border-[#D91E2A]/50 text-[#D91E2A] flex items-center justify-center shrink-0 font-bebas text-lg font-bold group-hover:bg-[#D91E2A] group-hover:text-white transition-colors">
                      {step.num}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-[#D91E2A] uppercase">
                        <span>{step.title}</span>
                      </div>
                      <p className="text-xs text-[#9A9A9A] mt-1 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Column 3: VELVET RED QUOTE CARD */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, delay: 0.35, ease: easing }}
            whileHover={{ y: -6, scale: 1.015 }}
            whileTap={{ y: -2, scale: 0.98 }}
            className="lg:col-span-4 flex flex-col justify-between bg-velvet-red p-8 rounded-2xl border border-red-500/30 text-white shadow-[0_15px_35px_rgba(217,30,42,0.25)] relative overflow-hidden group cursor-pointer transition-all"
          >
            {/* Background Accent Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-red-400/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <Quote className="w-10 h-10 text-white/40 mb-6" />
              
              <blockquote className="font-serif-luxury text-2xl sm:text-3xl font-normal leading-relaxed text-white mb-6">
                "Good design is not just how it looks, but how it works."
              </blockquote>

              <div className="font-serif-luxury italic text-2xl text-red-200">
                — Saad Ahmed
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-white/20 flex flex-col gap-4">
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-white/90 flex items-center gap-1.5">
                <span>LET'S CREATE SOMETHING GREAT TOGETHER.</span>
                <span className="text-red-300">✦</span>
              </div>

              <motion.a
                href="#contact"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3 bg-white text-[#800A10] font-bold text-xs tracking-widest uppercase rounded text-center hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
              >
                <span>Start A Project</span>
                <ArrowUpRight className="w-4 h-4" />
              </motion.a>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
