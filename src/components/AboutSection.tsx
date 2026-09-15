import React from 'react';
import { motion } from 'motion/react';
import { Compass, Sparkles, Target, Layers, Check } from 'lucide-react';
import designerPortrait from '../assets/images/regenerated_image_1785876654799.png';
import saadHeadshot from '../assets/images/saad_avatar_headshot_1785846847266.jpg';

export const AboutSection: React.FC = () => {
  const easing = [0.22, 1, 0.36, 1];

  return (
    <section id="about" className="py-24 relative bg-[#080808] border-t border-white/[0.08] overflow-hidden">
      <div className="max-w-[1600px] w-full mx-auto px-6 sm:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Sticky Header with Designer Profile Photo */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: easing }}
            className="lg:col-span-5 lg:sticky lg:top-32 flex flex-col gap-6"
          >
            {/* Designer Profile Image Card */}
            <div className="relative group overflow-hidden rounded-2xl border border-white/10 bg-[#111113] p-2 shadow-2xl max-w-sm">
              <img
                src={designerPortrait || saadHeadshot}
                alt="Saad Ahmed UI UX Designer"
                className="w-full h-64 object-cover rounded-xl filter brightness-105 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-70 pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] font-mono font-bold text-[#D91E2A] uppercase tracking-widest bg-black/60 px-2 py-1 rounded backdrop-blur-sm border border-white/10">
                  Saad Ahmed • UI/UX Specialist
                </span>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111113] border border-[#D91E2A]/30 self-start">
              <span className="text-[10px] font-mono tracking-widest text-[#D91E2A] font-bold uppercase">
                02 // ABOUT ME
              </span>
            </div>
            
            <h2 className="font-bebas text-4xl sm:text-5xl font-bold leading-none tracking-tight text-white uppercase">
              Crafting Digital Products With <br />
              <span className="font-serif-luxury italic font-normal text-[#D91E2A] capitalize text-3xl sm:text-4xl">Simplicity, Precision</span> & Purpose.
            </h2>

            <div className="flex flex-col gap-3 text-xs font-mono text-[#9A9A9A]">
              <a
                href="#location"
                className="flex items-center gap-3 group hover:text-white transition-colors cursor-pointer"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#D91E2A] group-hover:scale-125 transition-transform" />
                <span className="group-hover:text-[#D91E2A] underline underline-offset-4 decoration-[#D91E2A]/40 transition-colors">LOCATION: KARACHI, NORTH KARACHI, SECTOR 5A2</span>
              </a>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D91E2A]" />
                <span>EXPERIENCE: 3 YEARS AS UI/UX DESIGNER</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D91E2A]" />
                <span>SKILLS: FIGMA (80%), PHOTOSHOP (90%), UI/UX (75%)</span>
              </div>
            </div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: 0.2, ease: easing }}
            className="lg:col-span-7 flex flex-col gap-8"
          >
            <motion.div
              whileHover={{ y: -4, borderColor: 'rgba(217, 30, 42, 0.4)' }}
              whileTap={{ y: -2, scale: 0.99, borderColor: 'rgba(217, 30, 42, 0.7)' }}
              data-glass="true"
              className="glass-card crystal-glass p-8 sm:p-10 rounded-2xl relative overflow-hidden border border-white/10 transition-colors cursor-pointer"
            >
              <p className="font-sans-clean text-base sm:text-lg text-[#FFFFFF]/90 leading-relaxed font-normal mb-8">
                Passionate UI/UX Designer with practical experience in creating clean, modern, and user-friendly designs for websites. Skilled in Figma and Adobe Photoshop, with the ability to understand client requirements and turn ideas into attractive and easy-to-use interfaces. Always eager to learn new design trends and improve creative skills to deliver better user experiences.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 border-t border-white/[0.08]">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-white font-semibold text-sm">
                    <Target className="w-4 h-4 text-[#D91E2A]" />
                    <span>User-Centered Research</span>
                  </div>
                  <p className="text-xs text-[#9A9A9A] leading-relaxed">
                    Uncovering true friction points through qualitative interviews, usability testing, and persona mapping.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-white font-semibold text-sm">
                    <Layers className="w-4 h-4 text-[#D91E2A]" />
                    <span>Scalable Design Systems</span>
                  </div>
                  <p className="text-xs text-[#9A9A9A] leading-relaxed">
                    Building resilient Figma component libraries with automated design tokens and developer handoffs.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Design Philosophy Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <motion.div
                whileHover={{ y: -8, scale: 1.02, borderColor: 'rgba(217, 30, 42, 0.5)' }}
                whileTap={{ y: -3, scale: 0.97, borderColor: 'rgba(217, 30, 42, 0.8)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                data-glass="true"
                className="glass-card crystal-glass p-6 rounded-xl border border-white/[0.08] transition-colors cursor-pointer relative overflow-hidden"
              >
                <div className="text-3xl font-bebas text-[#D91E2A] mb-1">01</div>
                <h4 className="text-sm font-semibold text-white mb-1">Clarity First</h4>
                <p className="text-xs text-[#9A9A9A]">Eliminating clutter so core interactions feel effortless.</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -8, scale: 1.02, borderColor: 'rgba(217, 30, 42, 0.5)' }}
                whileTap={{ y: -3, scale: 0.97, borderColor: 'rgba(217, 30, 42, 0.8)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                data-glass="true"
                className="glass-card crystal-glass p-6 rounded-xl border border-white/[0.08] transition-colors cursor-pointer relative overflow-hidden"
              >
                <div className="text-3xl font-bebas text-[#D91E2A] mb-1">02</div>
                <h4 className="text-sm font-semibold text-white mb-1">Visual Hierarchy</h4>
                <p className="text-xs text-[#9A9A9A]">Mathematical typography ratios and purposeful whitespace.</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -8, scale: 1.02, borderColor: 'rgba(217, 30, 42, 0.5)' }}
                whileTap={{ y: -3, scale: 0.97, borderColor: 'rgba(217, 30, 42, 0.8)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                data-glass="true"
                className="glass-card crystal-glass p-6 rounded-xl border border-white/[0.08] transition-colors cursor-pointer relative overflow-hidden"
              >
                <div className="text-3xl font-bebas text-[#D91E2A] mb-1">03</div>
                <h4 className="text-sm font-semibold text-white mb-1">Business Growth</h4>
                <p className="text-xs text-[#9A9A9A]">Aligning visual elegance with high-converting user journeys.</p>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

