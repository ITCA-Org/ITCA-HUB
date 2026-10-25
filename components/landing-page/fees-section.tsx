'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import usePublicReducedMotion from '@/hooks/use-public-reduced-motion';
import FeesModal from './fees-modal';
import FeesStatusCheck from './fees-status-check';
import { Reveal, easeOut, fadeUp, stagger } from './reveal';
import { FEE_TOTAL_REQUIRED, formatFeeAmount } from '@/utils/fees';

const steps = [
  {
    number: '1',
    title: 'Pay each semester',
    color: '#FFFFFF',
    kicker: 'D50 each semester',
    body: 'ITCA semester dues keep bootcamps, sports days, retreats, and student initiatives running. Paying D50 each term spreads the load so the community stays funded without a last-minute scramble.',
    points: [
      'D50 per semester',
      'Supports events & bootcamps',
      'Pay as you go',
      'Keep your record current',
    ],
    image: '/fees/install.jpg',
    imageAlt: 'Paying fees on a phone — semester installment',
  },
  {
    number: '2',
    title: 'Settle',
    color: '#FFFFFF',
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
    color: '#FFFFFF',
    kicker: 'Audit form requires cleared dues',
    body: 'Students who have not cleared their ITCA dues cannot collect their audit form from the admin office. Stay current so graduation paperwork is not held up when you need it most.',
    points: [
      'Clear dues first',
      'Collect your audit form',
      'Admin office verification',
      'Graduate without delays',
    ],
    image: '/fees/graduate.jpg',
    imageAlt: 'Graduate in cap and gown holding a diploma',
  },
];

const FeesSection = () => {
  const reduce = usePublicReducedMotion();
  const [open, setOpen] = useState(false);

  return (
    <>
      <section id="why-fees" className="bg-white itca-white-surface">
        <div className="mx-auto max-w-[1400px] px-5 pb-12 pt-6 sm:px-10 sm:pb-16 sm:pt-8 lg:px-16">
          <div className="mb-4 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-10">
            <Reveal>
              <h2 className="text-2xl font-semibold text-[#005080]">Make a payment</h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="landing-mono text-sm leading-relaxed text-[#005080]/75">
                Pay D50 for a semester or {formatFeeAmount(FEE_TOTAL_REQUIRED)} in full. Check your
                balance below if you have paid before.
              </p>
            </Reveal>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-2 rounded-full bg-[#005080] itca-blue-surface px-7 py-3.5 text-sm font-semibold text-[var(--itca-accent-ink)] transition hover:brightness-110 sm:text-base"
            >
              Pay ITCA dues →
            </button>
          </div>
        </div>

        <FeesStatusCheck compact />
        <div className="relative">
          {steps.map((step, index) => (
            <article
              key={step.number}
              className={`relative lg:sticky lg:top-[6rem] rounded-t-[2.5rem] px-5 pt-14 sm:rounded-t-[4rem] sm:px-10 sm:pt-16 lg:px-16 lg:pt-20 ${
                index < 2 ? 'pb-20 sm:pb-24 lg:pb-28' : 'pb-12 sm:pb-14 lg:pb-16'
              } ${index > 0 ? 'lg:-mt-[4rem]' : ''}`}
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
                        className="text-5xl font-bold tracking-tight text-[#005080] sm:text-7xl lg:text-8xl"
                        initial={reduce ? false : { opacity: 0, x: -24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.7, ease: easeOut }}
                      >
                        {step.title}
                      </motion.h3>
                    </div>
                    <motion.span
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#005080] itca-blue-surface text-base font-bold text-white sm:h-14 sm:w-14 sm:text-lg"
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
                      className="max-w-2xl text-lg leading-relaxed text-[#005080] sm:text-xl lg:text-2xl lg:leading-snug"
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
                      className="rounded-full bg-[#005080] itca-blue-surface px-6 py-3.5 text-base font-semibold text-white sm:px-7 sm:py-4 sm:text-lg"
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

      <FeesModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default FeesSection;
