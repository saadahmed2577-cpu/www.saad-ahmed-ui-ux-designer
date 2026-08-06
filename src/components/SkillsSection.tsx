import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Figma as FigmaIcon,
  Layout as LayoutIcon,
  Layers as LayersIcon,
  Code as CodeIcon,
  Palette as PaletteIcon,
  Sparkles as SparklesIcon,
  Smartphone as SmartphoneIcon,
  Globe as GlobeIcon,
  PenTool as PenToolIcon,
  Workflow as WorkflowIcon,
  Cpu as CpuIcon,
  Monitor as MonitorIcon,
  CheckCircle2 as CheckIcon,
  Zap as ZapIcon
} from 'lucide-react';

export interface SkillItem {
  name: string;
  category: 'uiux' | 'tools' | 'dev' | 'strategy';
  level: number; // percentage e.g. 95
  experience: string;
  icon: React.ElementType;
  description: string;
  tags: string[];
}

export const SkillsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'uiux' | 'tools' | 'dev' | 'strategy'>('all');

  const skills: SkillItem[] = [
    {
      name: 'UI/UX Design',
      category: 'uiux',
      level: 75,
      experience: '3 Years',
      icon: LayoutIcon,
      description: 'Practical experience creating clean, modern, intuitive and user-friendly interfaces for websites.',
      tags: ['Wireframing', 'User Research', 'Prototyping', 'User-Centered Design'],
    },
    {
      name: 'Figma',
      category: 'tools',
      level: 80,
      experience: '3 Years',
      icon: FigmaIcon,
      description: 'Understanding client requirements and converting ideas into attractive, easy-to-use digital layouts.',
      tags: ['Components', 'Auto Layout', 'Prototypes', 'UI Components'],
    },
    {
      name: 'Adobe Photoshop',
      category: 'tools',
      level: 90,
      experience: '4+ Years',
      icon: PaletteIcon,
      description: 'Skilled in photo editing, image manipulation, graphics composition, flyers, and professional mockups.',
      tags: ['Photo Editing', 'Graphics', 'Flyers', 'Mock-Ups'],
    },
    {
      name: 'Web Designing',
      category: 'dev',
      level: 80,
      experience: '3 Years',
      icon: GlobeIcon,
      description: 'Designing responsive web layouts focused on visual hierarchy and high clarity.',
      tags: ['Responsive Web', 'Landing Pages', 'E-Commerce UI'],
    },
    {
      name: 'Photo Editing & Flyers',
      category: 'tools',
      level: 88,
      experience: '3 Years',
      icon: PenToolIcon,
      description: 'Crafting flyers, brand marketing assets, and high-impact digital photo enhancements.',
      tags: ['Flyers', 'Retouching', 'Visual Assets', 'Mock-Ups'],
    },
    {
      name: 'Mock-Up Design',
      category: 'uiux',
      level: 85,
      experience: '3 Years',
      icon: LayersIcon,
      description: 'Transforming rough sketches and concepts into high-fidelity product mock-ups.',
      tags: ['Product Mockups', 'Visual Presentation', 'Brand Assets'],
    },
  ];

  const filteredSkills = activeTab === 'all'
    ? skills
    : skills.filter(s => s.category === activeTab);

  const categories = [
    { id: 'all', label: 'All Skills' },
    { id: 'uiux', label: 'UI/UX Design' },
    { id: 'tools', label: 'Software & Tools' },
    { id: 'dev', label: 'Web & Frontend' },
    { id: 'strategy', label: 'Strategy & IA' },
  ] as const;

  const easing = [0.22, 1, 0.36, 1];

  return (
    <section id="skills" className="py-24 relative bg-[#080808] border-t border-white/[0.08] overflow-hidden">
      {/* Background Subtle Red Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#D91E2A]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1600px] w-full mx-auto px-6 sm:px-12 lg:px-16 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, ease: easing }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111113] border border-[#D91E2A]/30 mb-4">
              <SparklesIcon className="w-3.5 h-3.5 text-[#D91E2A]" />
              <span className="text-[10px] font-mono tracking-widest text-[#D91E2A] font-bold uppercase">
                TECHNICAL & CREATIVE CAPABILITIES
              </span>
            </div>
            <h2 className="font-bebas text-4xl sm:text-6xl font-bold tracking-tight text-white leading-none uppercase">
              Core Skills & <span className="font-serif-luxury italic font-normal text-[#D91E2A] capitalize text-3xl sm:text-5xl">Expertise</span>
            </h2>
          </motion.div>

          {/* Category Filter Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: easing }}
            className="flex flex-wrap gap-2 bg-[#111113] p-1.5 rounded-2xl border border-white/10 self-start md:self-auto"
          >
            {categories.map((cat) => {
              const isActive = activeTab === cat.id;
              return (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-300 relative cursor-pointer ${
                    isActive
                      ? 'text-white bg-[#D91E2A] shadow-[0_0_15px_rgba(217,30,42,0.4)]'
                      : 'text-[#9A9A9A] hover:text-white hover:bg-white/5 active:bg-white/10'
                  }`}
                >
                  {cat.label}
                </motion.button>
              );
            })}
          </motion.div>
        </div>

        {/* Skills Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill, index) => {
              const IconComponent = skill.icon;
              return (
                <motion.div
                  key={skill.name}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.04, ease: easing }}
                  whileHover={{ y: -6, borderColor: 'rgba(217,30,42,0.6)' }}
                  whileTap={{ y: -2, scale: 0.98, borderColor: 'rgba(217,30,42,0.8)' }}
                  className="glass-card p-6 rounded-2xl border border-white/10 bg-[#111113]/80 backdrop-blur-md flex flex-col justify-between group transition-all duration-300 relative overflow-hidden cursor-pointer"
                >
                  {/* Subtle Top Red Bar Accent on Hover */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#D91E2A] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div>
                    {/* Header Row */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#080808] border border-white/10 group-hover:border-[#D91E2A]/60 text-white group-hover:text-[#D91E2A] flex items-center justify-center shrink-0 transition-colors duration-300 shadow-inner">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-mono font-bold text-[#D91E2A] bg-[#D91E2A]/10 border border-[#D91E2A]/20 px-2.5 py-0.5 rounded-full uppercase">
                          {skill.experience}
                        </span>
                        <span className="text-xs font-mono font-bold text-white/80 mt-1">
                          {skill.level}% Proficiency
                        </span>
                      </div>
                    </div>

                    {/* Skill Title */}
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#D91E2A] transition-colors">
                      {skill.name}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-[#9A9A9A] leading-relaxed mb-6">
                      {skill.description}
                    </p>
                  </div>

                  {/* Level Progress Bar & Tags */}
                  <div>
                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-[#1B1B1E] rounded-full overflow-hidden mb-4">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-[#D91E2A] to-red-400 rounded-full shadow-[0_0_10px_rgba(217,30,42,0.8)]"
                      />
                    </div>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/[0.06]">
                      {skill.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono text-white/70 bg-white/5 px-2 py-0.5 rounded border border-white/5 group-hover:border-white/10 transition-colors"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Bottom Callout Feature Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.3, ease: easing }}
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.98 }}
          className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-[#111113] via-[#16161A] to-[#111113] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden"
        >
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-[#D91E2A] text-white flex items-center justify-center shrink-0 shadow-[0_0_25px_rgba(217,30,42,0.5)]">
              <ZapIcon className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white mb-1">
                Looking for a Custom Design System or UI Redesign?
              </h4>
              <p className="text-xs text-[#9A9A9A] leading-relaxed">
                I specialize in turning complex product ideas into modern, high-converting digital interfaces.
              </p>
            </div>
          </div>

          <motion.a
            href="#contact"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            className="whitespace-nowrap px-6 py-3.5 rounded-xl bg-white text-[#080808] hover:bg-[#D91E2A] hover:text-white font-bold text-xs tracking-widest uppercase transition-all duration-300 shadow-md cursor-pointer shrink-0"
          >
            Hire Me For Your Project
          </motion.a>
        </motion.div>

      </div>
    </section>
  );
};
