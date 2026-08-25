'use client';

import Image from 'next/image';
import { ArrowRight, Clock } from 'lucide-react';
import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Reveal, easeOut } from './reveal';

type Degree = {
  id: number;
  title: string;
  duration: string;
  description: string;
  image: string;
  highlights: string[];
  color: string;
  clientLabel: string;
};

const degrees: Degree[] = [
  {
    id: 1,
    title: 'Computer Science — build software with intent',
    clientLabel: 'Computer Science',
    duration: '4 years',
    description:
      'A comprehensive program covering programming, algorithms, data structures, and software engineering principles. Develop the technical skills necessary to design and build software systems that power today\'s digital economy.',
    image: '/ITCA_BOOTCAMP/IMG_8761.jpg',
    highlights: [
      'Specializations in AI, Cybersecurity, or Software Engineering',
      'Industry-partnered capstone projects',
      'Internship opportunities with leading tech companies',
      'Strong foundation in computational theory and practice',
      'Advanced algorithms and data structures',
    ],
    color: '#FFE0CC',
  },
  {
    id: 2,
    title: 'Information Systems — bridge people and technology',
    clientLabel: 'Information Systems',
    duration: '4 years',
    description:
      'Focus on bridging technology and business needs by designing, implementing, and managing information systems that support organizational operations. Learn to analyze business problems and develop technology solutions.',
    image: '/ITCA_BOOTCAMP/IMG_8866.jpg',
    highlights: [
      'Business process modeling and analysis',
      'Database design and management',
      'Project management methodologies',
      'Enterprise systems integration',
      'IT service management',
    ],
    color: '#D4E6F2',
  },
  {
    id: 3,
    title: 'Telecommunications — keep communities connected',
    clientLabel: 'Telecommunications',
    duration: '4 years',
    description:
      'Master the science and technology of communication at a distance through electronic transmission of information. Focus on network design, wireless communications, signal processing, and telecommunications infrastructure.',
    image: '/ITCA_WEEK/IMG_4608.jpg',
    highlights: [
      'Network architecture and protocols',
      'Wireless communications systems',
      'Signal processing techniques',
      'Optical communication technologies',
      'Telecommunications regulations and standards',
    ],
    color: '#005080',
  },
];

const DegreesSection = () => {
  const [openId, setOpenId] = useState<number>(1);
  const reduce = useReducedMotion();

  return (
    <section id="degrees" className="bg-white py-20">
      <div className="mx-auto mb-12 max-w-[1400px] px-4 sm:px-8 lg:px-12">
        <Reveal className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-3xl text-4xl font-bold text-[#0A1628] sm:text-5xl lg:text-6xl">
            The programmes that make up our community
          </h2>
          <p className="landing-mono max-w-md text-base text-[#0A1628]/70 sm:text-lg">
            Students from every School of ICT undergraduate programme are ITCA members.
          </p>
        </Reveal>
      </div>

      <div className="w-full space-y-5">
        {degrees.map((degree, index) => {
          const isOpen = openId === degree.id;
          const imageLeft = index % 2 === 1;
          const onBlue = degree.color === '#005080';
          const text = onBlue ? 'text-white' : 'text-[#0A1628]';
          const muted = onBlue ? 'text-white/80' : 'text-[#0A1628]/80';
          const dot = onBlue ? 'bg-white' : 'bg-[#0A1628]';

          return (
            <motion.article
              key={degree.id}
              initial={reduce ? false : { opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, delay: index * 0.08, ease: easeOut }}
              className="grid w-full gap-0 overflow-hidden rounded-none lg:grid-cols-2 lg:transition-[border-radius] lg:duration-300 lg:[&:has(.course-info:hover)]:overflow-visible"
            >
              <div
                className={`group relative min-h-[280px] overflow-hidden sm:min-h-[320px] lg:min-h-[420px] ${imageLeft ? 'lg:order-1' : 'lg:order-2'}`}
              >
                <Image
                  fill
                  alt={degree.clientLabel}
                  src={degree.image}
                  className="object-cover transition duration-700 lg:group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              <div
                className={`course-info relative z-10 flex min-h-[280px] flex-col justify-between rounded-none p-6 transition-[border-radius] duration-300 sm:min-h-[320px] sm:p-10 lg:min-h-[420px] lg:p-12 lg:hover:rounded-[5rem] ${imageLeft ? 'lg:order-2' : 'lg:order-1'}`}
                style={{ backgroundColor: degree.color }}
              >
                <div>
                  <h3 className={`max-w-xl text-2xl font-bold leading-tight sm:text-4xl lg:text-5xl ${text}`}>
                    {degree.title}
                  </h3>
                  <p className={`mt-4 flex flex-wrap items-center gap-2 text-sm font-medium sm:mt-5 sm:text-lg ${text}`}>
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${dot}`} />
                    {degree.clientLabel}
                    <Clock className="ml-1 h-4 w-4 shrink-0 sm:ml-2" />
                    {degree.duration}
                  </p>
                </div>

                <div className="mt-8 flex items-end justify-between gap-3 sm:mt-10 sm:gap-4">
                  <p className={`min-w-0 max-w-lg flex-1 text-sm leading-relaxed sm:text-lg ${muted}`}>
                    {isOpen ? degree.description : degree.highlights[0]}
                  </p>
                  <motion.button
                    type="button"
                    aria-expanded={isOpen}
                    aria-label={`Toggle ${degree.clientLabel} details`}
                    onClick={() => setOpenId(isOpen ? 0 : degree.id)}
                    whileHover={reduce ? undefined : { scale: 1.08 }}
                    whileTap={reduce ? undefined : { scale: 0.95 }}
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition hover:brightness-125 sm:h-14 sm:w-14 ${
                      onBlue ? 'bg-white text-[#005080]' : 'bg-[#0A1628] text-white'
                    }`}
                  >
                    <ArrowRight
                      className={`h-6 w-6 transition ${isOpen ? 'rotate-90' : ''}`}
                    />
                  </motion.button>
                </div>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.ul
                      key="highlights"
                      initial={reduce ? false : { opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={reduce ? undefined : { opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: easeOut }}
                      className="mt-8 space-y-3 overflow-hidden"
                    >
                      {degree.highlights.map((highlight) => (
                        <li key={highlight} className={`text-base sm:text-lg ${text}`}>
                          → {highlight}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
};

export default DegreesSection;
