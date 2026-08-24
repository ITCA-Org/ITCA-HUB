'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { Reveal, easeOut, fadeUp, stagger } from './reveal';

const steps = [
  {
    number: '1',
    title: 'Learn',
    color: '#D4E6F2',
    kicker: 'Skills practice that sticks',
    body: 'We organise bootcamps, workshops, and hands-on sessions so ICT students can practice what they learn in class—coding, networking, design, and more—with peers who get it.',
    points: ['Bootcamps', 'Workshops', 'Peer learning', 'Project practice'],
    image: '/ITCA_BOOTCAMP/IMG_8789.jpg',
    imageAlt: 'Students at an ITCA bootcamp skills session',
  },
  {
    number: '2',
    title: 'Play',
    color: '#FFE0CC',
    kicker: 'Sporting events and campus life',
    body: 'ITCA is not only labs and lectures. We run sporting events and campus activities that bring School of ICT students together, build friendships, and balance the semester.',
    points: ['Sports days', 'Campus games', 'Team spirit', 'Fun with classmates'],
    image: '/ITCA_SPORTS/IMG_8179.jpg',
    imageAlt: 'ITCA Trials and Thrills football on campus',
  },
  {
    number: '3',
    title: 'Belong',
    color: '#FF6A00',
    kicker: 'Retreats, friendships, and real connection',
    body: 'From Computer Science to Information Systems and Telecommunications, ITCA is the shared home for School of ICT students—retreats, hangouts, and a network you can lean on outside the classroom.',
    points: ['Student retreats', 'Campus hangouts', 'Shared meals', 'Lifelong friendships'],
    image: '/ITCA_RETREAT/KG__0436.jpg',
    imageAlt: 'ITCA students sharing a meal at the retreat',
  },
];

const ApproachSection = () => {
  const reduce = useReducedMotion();

  return (
    <section id="community" className="bg-white">
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-10 lg:px-16">
        <div className="mb-16 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <Reveal>
            <h2 className="text-4xl font-bold leading-[1.1] text-[#0A1628] sm:text-5xl md:text-6xl">
              A student community that learns, plays, and shows up together.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="landing-mono text-sm leading-relaxed text-[#0A1628]/75">
              ITCA organises initiatives across the School of ICT—bootcamps, workshops, sporting
              events, and retreats—so studying tech at UTG feels like being part of something bigger.
            </p>
          </Reveal>
        </div>
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
  );
};

export default ApproachSection;
