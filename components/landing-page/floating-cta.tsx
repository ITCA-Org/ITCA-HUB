'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import FeedbackModal from './feedback-modal';
import { easeOut } from './reveal';

const FloatingCta = () => {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8, ease: easeOut }}
        whileHover={reduce ? undefined : { scale: 1.04, y: -2 }}
        whileTap={reduce ? undefined : { scale: 0.98 }}
        className="fixed bottom-5 right-4 z-40 max-w-[min(100%,calc(100vw-2rem))] rounded-full bg-[#0A1628] px-5 py-2.5 text-left text-sm font-semibold text-[#FF6A00] shadow-[0_10px_30px_rgba(0,0,0,0.25)] sm:bottom-6 sm:right-6 sm:min-w-[260px] sm:px-9 sm:py-3 sm:text-lg"
      >
        {!reduce && (
          <motion.span
            className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-[#FF6A00]/40"
            animate={{ opacity: [0.55, 0, 0.55], scale: [1, 1.08, 1] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        <span className="relative">
          Got feedback?{' '}
          <span className="underline decoration-[#FF6A00] underline-offset-4">Share it!</span>
        </span>
      </motion.button>

      <FeedbackModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default FloatingCta;
