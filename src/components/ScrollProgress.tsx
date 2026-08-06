import React from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

export const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#D91E2A] via-[#FF525D] to-[#D91E2A] z-[100] origin-left shadow-[0_0_12px_rgba(217,30,42,0.8)] pointer-events-none"
      style={{ scaleX }}
    />
  );
};
