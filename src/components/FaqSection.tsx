import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown, Sparkles, CheckCircle2, MessageSquare, Briefcase, Zap, Shield, Clock } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FaqItem[] = [
  {
    category: 'Work & Process',
    question: 'What is your typical design turnaround time for a project?',
    answer: 'Standard landing pages and UX audits take approximately 3 to 7 business days. Full design systems, multi-screen mobile apps, and complex SaaS dashboards usually take 2 to 4 weeks depending on the scope, feedback iterations, and complexity.',
  },
  {
    category: 'Tools & Handoff',
    question: 'Which design tools do you use, and how do you hand off to developers?',
    answer: 'I design primarily in Figma and Adobe Photoshop. Every project is delivered with organized autolayout frames, atomic design components, responsive breakpoints (Desktop, Tablet, Mobile), typography scales, color tokens, and interactive clickable prototypes with developer-ready CSS/token inspect guidelines.',
  },
  {
    category: 'Services',
    question: 'Do you work with international clients outside Pakistan?',
    answer: 'Yes! I collaborate regularly with clients worldwide across the US, UK, Middle East, and Europe through remote workflows, Fiverr, and Freelancer platforms. I adapt to client time zones and hold flexible check-in calls.',
  },
  {
    category: 'Revisions & Quality',
    question: 'How many design revisions are included in a project?',
    answer: 'All projects include up to 3 comprehensive revision rounds to refine layouts, typography, visual weight, and interaction flows until you are completely satisfied with the result.',
  },
  {
    category: 'Pricing & Contracts',
    question: 'How do you charge for UI/UX and product design services?',
    answer: 'I offer both fixed-price project milestones and flexible hourly or weekly retainer packages. A formal quote is provided after our initial project discovery call or message review.',
  },
  {
    category: 'Development Support',
    question: 'Do you also provide frontend web development or design implementation?',
    answer: 'Yes, in addition to UI/UX design in Figma, I build modern responsive websites using React, Tailwind CSS, and Webflow, ensuring your final live site matches the approved designs pixel-for-pixel.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 sm:py-32 relative border-t border-white/5 bg-[#0A0A0C]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#D91E2A]/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16">
          
          {/* Left Column: Title & Trust Badges */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#D91E2A] text-xs font-mono">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>

            <h2 className="font-bebas text-4xl sm:text-6xl font-bold leading-none tracking-tight text-white uppercase">
              GOT QUESTIONS? <br />
              <span className="font-serif-luxury italic font-normal text-[#D91E2A] capitalize text-3xl sm:text-5xl">
                Here are the answers.
              </span>
            </h2>

            <p className="text-sm text-[#9A9A9A] font-sans-clean leading-relaxed">
              Transparent, professional collaboration from the initial sketch to developer handoff. Have a question not listed here? Message me directly through the in-page contact form or WhatsApp.
            </p>

            {/* Trust highlights */}
            <div className="pt-4 grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-[#111113] border border-white/10 flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#D91E2A] shrink-0" />
                <span className="text-white/90">24-Hour Reply</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#111113] border border-white/10 flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-[#D91E2A] shrink-0" />
                <span className="text-white/90">NDA & IP Protected</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#111113] border border-white/10 flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-[#D91E2A] shrink-0" />
                <span className="text-white/90">Fast Turnarounds</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#111113] border border-white/10 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#D91E2A] shrink-0" />
                <span className="text-white/90">100% Satisfaction</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D91E2A] hover:bg-[#b81722] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(217,30,42,0.35)]"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Start A Project Inquiry</span>
              </a>
            </div>
          </div>

          {/* Right Column: Accordion Questions */}
          <div className="lg:col-span-7 space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'bg-[#121216] border-[#D91E2A]/50 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
                      : 'bg-[#0E0E11] border-white/10 hover:border-white/20'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-[#D91E2A] font-bold">
                        0{idx + 1}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-white font-sans-clean">
                        {faq.question}
                      </h3>
                    </div>

                    <div
                      className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen
                          ? 'border-[#D91E2A] bg-[#D91E2A] text-white rotate-180'
                          : 'border-white/10 bg-white/5 text-[#9A9A9A]'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0 border-t border-white/5">
                          <p className="text-xs sm:text-sm text-[#B5B5B5] leading-relaxed pt-3 font-sans-clean">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};
