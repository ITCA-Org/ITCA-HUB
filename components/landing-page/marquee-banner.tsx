'use client';

import { motion, useReducedMotion } from 'framer-motion';

const phrases = [
  'School of ICT',
  'Every student is a member',
  'Bootcamps',
  'Workshops',
  'Sporting events',
  'Retreats',
  'Student community',
  'Faraba Banta',
];

const MarqueeBanner = () => {
  const reduce = useReducedMotion();
  const loop = [...phrases, ...phrases, ...phrases, ...phrases];

  return (
    <motion.div
      className="landing-marquee relative overflow-hidden bg-[#005080] py-4 text-white"
      initial={reduce ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#005080] to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#005080] to-transparent sm:w-24" />
      <div
        className={`landing-marquee-track flex items-center gap-6 whitespace-nowrap px-6 text-lg font-semibold sm:text-xl ${
          reduce ? 'landing-marquee-track--static' : ''
        }`}
      >
        {loop.map((phrase, index) => (
          <span key={`${phrase}-${index}`} className="flex items-center gap-6">
            {phrase}
            <span aria-hidden className="text-2xl font-light text-[#FF6A00]">
              →
            </span>
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export default MarqueeBanner;
