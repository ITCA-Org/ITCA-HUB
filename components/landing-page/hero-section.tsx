'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { easeOut } from './reveal';

const HeroSection = () => {
  const reduce = useReducedMotion();

  return (
    <section id="hero-section" className="relative">
      <div className="sticky top-0 z-0 h-[100svh] w-full overflow-hidden bg-[#1a1a1a]">
        <motion.div
          className="absolute inset-0"
          initial={reduce ? false : { scale: 1.08 }}
          animate={reduce ? { scale: 1 } : { scale: [1.08, 1.02, 1.05] }}
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 18, times: [0, 0.15, 1], ease: ['easeOut', 'linear'], repeat: Infinity, repeatType: 'mirror' }
          }
        >
          <Image
            fill
            priority
            quality={92}
            alt="ITCA students at the University of The Gambia"
            src="/IMG_4410.jpg"
            className="object-cover object-[center_30%] sm:object-center"
            sizes="(max-width: 768px) 100vw, 100vw"
          />
        </motion.div>
      </div>

      <div className="relative z-10 -mt-[100svh]">
        <div
          id="hero-banner"
          className="flex min-h-[48svh] w-full items-end rounded-b-[3rem] bg-white px-5 pb-12 pt-28 sm:rounded-b-[5rem] sm:px-10 sm:pb-16 lg:min-h-[52svh] lg:rounded-b-[7rem] lg:px-16"
        >
          <motion.h1
            className="max-w-5xl text-4xl font-bold leading-[1.08] text-[#005080] sm:text-5xl md:text-6xl lg:text-7xl"
            initial={reduce ? false : { opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.15, ease: easeOut }}
          >
            You&apos;re in the School of ICT.{' '}
            <span className="underline decoration-[#005080] decoration-2 underline-offset-8">
              You&apos;re already ITCA.
            </span>
          </motion.h1>
        </div>
        <div className="h-[90svh]" aria-hidden="true" />
      </div>
    </section>
  );
};

export default HeroSection;
