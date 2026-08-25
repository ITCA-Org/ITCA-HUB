'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import FeesModal from './fees-modal';
import { Reveal, easeOut, fadeUp, stagger } from './reveal';
import { FEE_TOTAL_REQUIRED, formatFeeAmount } from '@/utils/fees';

const steps = [
  {
    number: '1',
    title: 'Install',
    color: '#D4E6F2',
    kicker: 'D50 each semester',
    body: 'ITCA semester dues keep bootcamps, sports days, retreats, and student initiatives running. Paying D50 each term spreads the load so the community stays funded without a last-minute scramble.',
    points: ['D50 per semester', 'Supports events & bootcamps', 'Pay as you go', 'Keep your record current'],
    image: '/fees/install.jpg',
    imageAlt: 'Paying fees on a phone — semester installment',
  },
  {
    number: '2',
    title: 'Settle',
    color: '#FFE0CC',
    kicker: `${formatFeeAmount(FEE_TOTAL_REQUIRED)} before you graduate`,
    body: `Before graduation you must have paid a total of ${formatFeeAmount(FEE_TOTAL_REQUIRED)}. You can clear it semester by semester, or settle the full amount in one go if you prefer to finish early.`,
    points: [
      `${formatFeeAmount(FEE_TOTAL_REQUIRED)} total due`,
      'Pay in full anytime',
      'Track what you have paid',
      'No surprises at the end',
    ],
    image: '/fees/money.jpeg',
    imageAlt: 'Money — settling the full fee balance',
  },
  {
    number: '3',
    title: 'Graduate',
    color: '#FF6A00',
    kicker: 'Audit form requires cleared dues',
    body: 'Students who have not cleared their ITCA dues cannot collect their audit form from the admin office. Stay current so graduation paperwork is not held up when you need it most.',
    points: ['Clear dues first', 'Collect your audit form', 'Admin office verification', 'Graduate without delays'],
    image: '/fees/graduate.jpg',
    imageAlt: 'Graduate in cap and gown holding a diploma',
  },
];

const FeesSection = () => {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <>
      <section id="why-fees" className="bg-white">
        <div className="mx-auto max-w-[1400px] px-5 pb-12 pt-6 sm:px-10 sm:pb-16 sm:pt-8 lg:px-16">
          <div className="mb-4 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-10">
            <Reveal>
              <h2 className="text-4xl font-bold leading-[1.1] text-[#0A1628] sm:text-5xl md:text-6xl">
                Why fees matter—and how to stay clear before graduation.
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="landing-mono text-sm leading-relaxed text-[#0A1628]/75">
                Your dues fund the community you rely on. Install D50 a semester, settle{' '}
                {formatFeeAmount(FEE_TOTAL_REQUIRED)} in full, and keep your audit form within reach.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.18}>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-2 rounded-full bg-[#0A1628] px-7 py-3.5 text-sm font-semibold text-[#FF6A00] transition hover:brightness-110 sm:text-base"
            >
              Ready to pay?{' '}
              <span className="underline decoration-[#FF6A00] underline-offset-4">Open form</span>
            </button>
          </Reveal>
        </div>

        <div className="relative">
          {steps.map((step, index) => (
            <article
              key={step.number}
              className={`sticky top-[5rem] rounded-t-[2.5rem] px-5 pt-14 sm:rounded-t-[4rem] sm:px-10 sm:pt-16 lg:px-16 lg:pt-20 ${
                index < 2 ? 'pb-20 sm:pb-24 lg:pb-28' : 'pb-12 sm:pb-14 lg:pb-16'
              } ${index > 0 ? '-mt-[2.5rem] sm:-mt-[4rem]' : ''}`}
              style={{
                backgroundColor: step.color,
                zIndex: index + 1,
              }}
            >
              <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
                <div>
                  <div className="mb-10 flex items-start justify-between gap-4">
                    <div>
                      <p className="landing-mono mb-4 text-base sm:text-lg">{step.kicker}</p>
                      <motion.h3
                        className="text-5xl font-bold tracking-tight text-[#0A1628] sm:text-7xl lg:text-8xl"
                        initial={reduce ? false : { opacity: 0, x: -24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.7, ease: easeOut }}
                      >
                        {step.title}
                      </motion.h3>
                    </div>
                    <motion.span
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0A1628] text-base font-bold text-white sm:h-14 sm:w-14 sm:text-lg"
                      initial={reduce ? false : { scale: 0.6, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: 0.15, ease: easeOut }}
                    >
                      {step.number}
                    </motion.span>
                  </div>

                  <div className="grid gap-8 md:grid-cols-[0.95fr_1.05fr] md:items-start md:gap-10">
                    <motion.div
                      className="relative h-56 overflow-hidden rounded-[1.75rem] sm:h-64 md:h-72 lg:h-80"
                      initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.7, ease: easeOut }}
                    >
                      <Image
                        fill
                        alt={step.imageAlt}
                        src={step.image}
                        className="object-cover object-center transition duration-700 hover:scale-105"
                      />
                    </motion.div>
                    <motion.p
                      className="max-w-2xl text-lg leading-relaxed text-[#0A1628] sm:text-xl lg:text-2xl lg:leading-snug"
                      initial={reduce ? false : { opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.65, delay: 0.1, ease: easeOut }}
                    >
                      {step.body}
                    </motion.p>
                  </div>
                </div>

                <motion.ul
                  className="space-y-4 self-end"
                  variants={reduce ? undefined : stagger}
                  initial={reduce ? false : 'hidden'}
                  whileInView={reduce ? undefined : 'show'}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  {step.points.map((point) => (
                    <motion.li
                      key={point}
                      variants={reduce ? undefined : fadeUp}
                      transition={{ duration: 0.5, ease: easeOut }}
                      whileHover={reduce ? undefined : { x: 6, scale: 1.02 }}
                      className="rounded-full bg-[#0A1628] px-6 py-3.5 text-base font-semibold text-white sm:px-7 sm:py-4 sm:text-lg"
                    >
                      {point}
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5, ease: easeOut }}
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
          Pay your fees?{' '}
          <span className="underline decoration-[#FF6A00] underline-offset-4">Open form</span>
        </span>
      </motion.button>

      <FeesModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default FeesSection;
