'use client';

import Link from 'next/link';
import {
  BookOpen,
  Code,
  Download,
  FileText,
  Layers,
  Lock,
  ScrollText,
  Video,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Reveal, easeOut, fadeUp, stagger } from './reveal';

const resourceCategories = [
  {
    name: 'Past Papers',
    icon: ScrollText,
    description: 'Exams, tests, quizzes — preview & download',
    color: '#FFE0CC',
    href: '/past-papers',
  },
  {
    name: 'E-Books & Guides',
    icon: BookOpen,
    count: 120,
    color: '#D4E6F2',
  },
  {
    name: 'Lecture Notes',
    icon: FileText,
    count: 85,
    color: '#FF6A00',
  },
  {
    name: 'Tutorial Videos',
    icon: Video,
    count: 64,
    color: '#FFE0CC',
  },
  {
    name: 'Code Samples',
    icon: Code,
    count: 230,
    color: '#D4E6F2',
  },
  {
    name: 'Software Tools',
    icon: Download,
    count: 46,
    color: '#FF6A00',
  },
  {
    name: 'Practice Projects',
    icon: Layers,
    count: 37,
    color: '#FFE0CC',
  },
];

const ResourcesSection = () => {
  const reduce = useReducedMotion();

  return (
    <section id="resources" className="bg-white pb-24 pt-8">
      <div className="mx-auto mb-8 max-w-[1400px] px-4 sm:px-8 lg:px-12">
        <Reveal className="rounded-[2rem] bg-[#0A1628] p-8 text-white sm:p-10">
          <p className="landing-mono mb-4 text-sm text-[#FF6A00]">
            For School of ICT students
          </p>
          <h2 className="max-w-2xl text-4xl font-bold sm:text-5xl">
            Shared resources for the community
          </h2>
          <p className="mt-4 max-w-xl text-white/70">
            Notes, tools, past papers, and practice materials to support your
            semester—put together for ITCA members across the School of ICT.
          </p>
        </Reveal>
      </div>

      <motion.div
        className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        variants={reduce ? undefined : stagger}
        initial={reduce ? false : 'hidden'}
        whileInView={reduce ? undefined : 'show'}
        viewport={{ once: true, amount: 0.15 }}
      >
        {resourceCategories.map((category) => {
          const Icon = category.icon;
          const onAccent =
            category.color === '#FF6A00' || category.color === '#005080';
          const content = (
            <>
              <div className="flex items-start justify-between">
                <Icon
                  className={`h-8 w-8 ${onAccent ? 'text-white' : 'text-[#0A1628]'}`}
                />
                {category.href ? (
                  <span
                    className={`text-xs font-semibold uppercase tracking-wide ${
                      onAccent ? 'text-white/80' : 'text-[#0A1628]/55'
                    }`}
                  >
                    Open
                  </span>
                ) : (
                  <Lock
                    className={`h-4 w-4 ${onAccent ? 'text-white/70' : 'text-[#0A1628]/60'}`}
                  />
                )}
              </div>
              <div>
                {'count' in category && category.count != null ? (
                  <p
                    className={`text-6xl font-extrabold leading-none sm:text-7xl ${
                      onAccent ? 'text-white' : 'text-[#0A1628]'
                    }`}
                  >
                    {category.count}+
                  </p>
                ) : null}
                <h3
                  className={`text-xl font-bold sm:text-2xl ${
                    'count' in category && category.count != null ? 'mt-3' : ''
                  } ${onAccent ? 'text-white' : 'text-[#0A1628]'}`}
                >
                  {category.name}
                </h3>
                {'description' in category && category.description ? (
                  <p
                    className={`mt-2 text-sm ${
                      onAccent ? 'text-white/80' : 'text-[#0A1628]/70'
                    }`}
                  >
                    {category.description}
                  </p>
                ) : null}
              </div>
            </>
          );

          return (
            <motion.div
              key={category.name}
              variants={reduce ? undefined : fadeUp}
              transition={{ duration: 0.55, ease: easeOut }}
              whileHover={reduce ? undefined : { y: -2 }}
              className="flex min-h-[240px] flex-col justify-between p-8 sm:min-h-[280px] sm:p-10 lg:min-h-[320px] lg:p-12"
              style={{ backgroundColor: category.color }}
            >
              {category.href ? (
                <Link
                  href={category.href}
                  className="flex h-full min-h-[inherit] flex-col justify-between"
                >
                  {content}
                </Link>
              ) : (
                content
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};

export default ResourcesSection;
