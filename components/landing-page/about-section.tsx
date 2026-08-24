'use client';

import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Reveal } from './reveal';

/** Firefly-style loop arrow: horizontal → rounded loop → down → soft arrowhead */
const LoopArrow = () => (
  <svg
    viewBox="0 0 348 356"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-full w-full"
    aria-hidden
  >
    <motion.path
      d="M0 122.733L286.134 122.733C319.749 122.733 347 95.4818 347 61.8663V59.6274C347 27.2484 320.752 1 288.373 1V1C255.994 1 229.745 27.2483 229.745 59.6273L229.745 344.715"
      stroke="#0A1628"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
    />
    <motion.path
      d="M181 312.742C197.166 312.742 229.499 321.393 229.499 355.997"
      stroke="#0A1628"
      strokeWidth="2.5"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, delay: 1.15, ease: 'easeOut' }}
    />
    <motion.path
      d="M277.999 314.409C261.833 313.3 229.5 320.065 229.5 356"
      stroke="#0A1628"
      strokeWidth="2.5"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, delay: 1.15, ease: 'easeOut' }}
    />
  </svg>
);

const AboutSection = () => {
  return (
    <section id="about" className="bg-white">
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-10 lg:px-16 lg:py-28">
        <Reveal>
          <p className="landing-mono mb-10 max-w-xl text-sm text-[#0A1628]/80 sm:ml-auto lg:mb-16">
            Bootcamps. Workshops. Sporting events. Retreats. Campus initiatives. ITCA is the
            student community that keeps School of ICT life moving—beyond the lecture hall.
          </p>
        </Reveal>

        <div className="relative">
          <Reveal className="relative z-10 max-w-3xl lg:max-w-[52%]" delay={0.1}>
            <h2 className="text-3xl font-bold leading-[1.15] text-[#0A1628] sm:text-4xl md:text-5xl lg:text-[3.25rem]">
              ITCA is the Information Technology Communication Association—the student association
              for everyone in the School of ICT at the University of The Gambia. If you study ICT
              here, you&apos;re part of us.
            </h2>

            <p className="landing-mono mt-12 max-w-md text-sm text-[#0A1628]/70 lg:mt-28">
              Faraba Banta Campus · School of Information Communication and Technology · UTG
            </p>
          </Reveal>

          <div className="pointer-events-none absolute right-0 top-[8%] hidden h-[min(56vw,420px)] w-[min(42vw,340px)] lg:block xl:top-[4%] xl:h-[460px] xl:w-[360px]">
            <LoopArrow />
          </div>
        </div>
      </div>

      <div className="bg-[#0A1628] px-5 py-24 sm:px-10 lg:px-16">
        <Reveal>
          <p className="text-4xl font-bold text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Campus is better when we
          </p>
        </Reveal>
        <Reveal delay={0.15} y={40}>
          <p className="mt-2 text-5xl font-extrabold tracking-[0.08em] text-[#D4E6F2] sm:text-6xl md:text-7xl lg:text-8xl">
            SHOW UP
          </p>
        </Reveal>
        <Reveal delay={0.28}>
          <a
            href="/community"
            className="mt-10 inline-flex items-center gap-2 text-[#FF6A00] underline decoration-[#FF6A00] underline-offset-4 transition hover:gap-3"
          >
            See what we organise
            <ArrowRight className="h-4 w-4" />
          </a>
        </Reveal>
      </div>
    </section>
  );
};

export default AboutSection;
