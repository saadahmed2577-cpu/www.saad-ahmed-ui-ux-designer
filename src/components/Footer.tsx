import React from 'react';
import { motion } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { SaadSignature } from './SaadSignature';

interface FooterProps {
  onOpenInbox?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenInbox }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const easing = [0.22, 1, 0.36, 1];

  return (
    <footer className="py-16 bg-[#080808] border-t border-white/[0.08] relative overflow-hidden">
      <div className="max-w-[1600px] w-full mx-auto px-6 sm:px-12 lg:px-16">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b border-white/[0.08]">
          
          {/* Brand & Slogan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: easing }}
            className="space-y-3 max-w-md"
          >
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="font-bebas font-bold text-white text-2xl tracking-wider uppercase leading-none">
                  SAAD AHMED
                </span>
                <span className="text-[9px] text-[#D91E2A] font-mono font-bold uppercase tracking-widest mt-0.5">
                  WEB DESIGNER & UI/UX CREATOR
                </span>
              </div>
              <div className="border-l border-white/10 pl-4 py-1">
                <SaadSignature className="h-9 w-auto" />
              </div>
            </div>
            <p className="font-sans-clean text-xs text-[#9A9A9A] leading-relaxed">
              Designing digital experiences that feel premium, look timeless, and perform beautifully.
            </p>
          </motion.div>

          {/* Quick Links & Back to top */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: easing }}
            className="flex flex-wrap items-center gap-6"
          >
            <a href="#about" className="text-xs font-bold uppercase tracking-wider text-[#9A9A9A] hover:text-white transition-colors">
              About
            </a>
            <a href="#projects" className="text-xs font-bold uppercase tracking-wider text-[#9A9A9A] hover:text-white transition-colors">
              Projects
            </a>
            <a href="#process" className="text-xs font-bold uppercase tracking-wider text-[#9A9A9A] hover:text-white transition-colors">
              Process
            </a>
            <a href="#faq" className="text-xs font-bold uppercase tracking-wider text-[#9A9A9A] hover:text-white transition-colors">
              FAQ
            </a>
            <a href="#contact" className="text-xs font-bold uppercase tracking-wider text-[#9A9A9A] hover:text-white transition-colors">
              Contact
            </a>
            <a
              href="#contact"
              className="text-xs font-bold uppercase tracking-wider text-[#D91E2A] hover:text-white transition-colors"
            >
              WhatsApp (+92 345 8273354)
            </a>

            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.15, y: -2, borderColor: '#D91E2A', color: '#D91E2A' }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-full bg-[#111113] border border-white/10 text-white transition-colors ml-2 cursor-pointer"
              title="Scroll to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </motion.button>
          </motion.div>

        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#9A9A9A] gap-4">
          <div>
            © 2026 SAAD AHMED. All Rights Reserved.
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>DESIGNED IN FIGMA</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>BUILT WITH REACT & TAILWIND</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

