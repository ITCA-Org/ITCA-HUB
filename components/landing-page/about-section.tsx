'use client';

import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import usePublicReducedMotion from '@/hooks/use-public-reduced-motion';
import { Reveal } from './reveal';

const partnerLogos = [
  { name: 'Alfudi', src: '/partners/alfudi.con_ppng (1).png' },
  { name: 'Bah and Jobe', src: '/partners/bah and jobe.jpg' },
  { name: 'SUMASYS', src: '/partners/Centered SUMASYS logo on white canvas (1).png' },
  { name: 'DX', src: '/partners/dx logo vertical (1).png' },
  { name: 'Getlab', src: '/partners/Getlab.jpg' },
  {
    name: 'Hybrid Tech Connected Network',
    src: '/partners/Hybrid Tech Connected Network Logo (1).png',
  },
  { name: 'Partner', src: '/partners/image (1).png' },
  { name: 'Partner', src: '/partners/image.png' },
  { name: 'Jokko9', src: '/partners/jokko9-logo.png' },
  { name: 'KG', src: '/partners/kglogo (1).png' },
  { name: 'KIT', src: '/partners/kit.jpg' },
  { name: 'PS', src: '/partners/PS-LOGO-MAIN (1).png' },
  { name: 'PSDEV Solutions', src: '/partners/PSDEV Solutions centered square logo (1).png' },
];

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
      stroke="#005080"
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
      stroke="#005080"
      strokeWidth="2.5"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, delay: 1.15, ease: 'easeOut' }}
    />
    <motion.path
      d="M277.999 314.409C261.833 313.3 229.5 320.065 229.5 356"
      stroke="#005080"
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
  const reduce = usePublicReducedMotion();
  const logos = reduce ? partnerLogos : [...partnerLogos, ...partnerLogos];

  return (
    <section id="about" className="bg-white itca-white-surface">
      <div className="overflow-hidden py-20 lg:py-28">
        <Reveal>
          <h2 className="mx-auto mb-10 max-w-[1400px] px-5 text-2xl font-semibold text-[#005080] sm:px-10 sm:text-3xl lg:mb-16 lg:px-16">
            Our partners
          </h2>
        </Reveal>

        <div className="relative overflow-hidden" aria-label="ITCA partners" role="region">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-28" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-28" />
          <div
            className={`landing-partners-track flex w-max items-center gap-5 px-5 sm:gap-8 sm:px-10 lg:px-16 ${
              reduce ? 'landing-partners-track--static' : ''
            }`}
          >
            {logos.map((partner, index) => (
              <div
                key={`${partner.src}-${index}`}
                className="flex h-28 w-40 shrink-0 items-center justify-center rounded-2xl bg-white p-4 sm:h-32 sm:w-48"
              >
                <Image
                  src={partner.src}
                  alt={index < partnerLogos.length ? partner.name : ''}
                  width={192}
                  height={192}
                  className="h-full w-full object-contain"
                  aria-hidden={index >= partnerLogos.length}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-5 pb-20 sm:px-10 lg:px-16 lg:pb-28">
        <div className="relative">
          <Reveal className="relative z-10 max-w-3xl lg:max-w-[52%]" delay={0.1}>
            <h2 className="text-2xl font-semibold text-[#005080] sm:text-3xl">About us</h2>
            <p className="mt-8 text-3xl font-bold leading-[1.15] text-[#005080] sm:text-4xl md:text-5xl lg:text-[3.25rem]">
              ITCA is the Information Technology Communication Association—the student association
              for everyone in the School of ICT at the University of The Gambia. If you study ICT
              here, you&apos;re part of us.
            </p>

            <p className="landing-mono mt-12 max-w-md text-sm text-[#005080]/70 lg:mt-28">
              Faraba Banta Campus · School of Information Communication and Technology · UTG
            </p>
          </Reveal>

          <div className="pointer-events-none absolute right-0 top-[8%] hidden h-[min(56vw,420px)] w-[min(42vw,340px)] lg:block xl:top-[4%] xl:h-[460px] xl:w-[360px]">
            <LoopArrow />
          </div>
        </div>
      </div>

      <div className="bg-[#005080] itca-blue-surface px-5 py-24 sm:px-10 lg:px-16">
        <Reveal>
          <p className="text-4xl font-bold text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Campus is better when we
          </p>
        </Reveal>
        <Reveal delay={0.15} y={40}>
          <p className="mt-2 text-5xl font-extrabold tracking-[0.08em] text-[#FFFFFF] sm:text-6xl md:text-7xl lg:text-8xl">
            SHOW UP
          </p>
        </Reveal>
        <Reveal delay={0.28}>
          <a
            href="/community"
            className="mt-10 inline-flex items-center gap-2 text-[var(--itca-accent-ink)] underline decoration-[var(--itca-accent-ink)] underline-offset-4 transition hover:gap-3"
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
