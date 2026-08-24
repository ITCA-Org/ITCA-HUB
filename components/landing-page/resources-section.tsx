'use client';

import { BookOpen, Code, Download, FileText, Layers, Lock, Video } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Reveal, easeOut, fadeUp, stagger } from './reveal';

const resourceCategories = [
  {
    name: 'E-Books & Guides',
    icon: BookOpen,
    count: 120,
    color: '#FFE0CC',
  },
  {
    name: 'Lecture Notes',
    icon: FileText,
    count: 85,
    color: '#D4E6F2',
  },
  {
    name: 'Tutorial Videos',
    icon: Video,
    count: 64,
    color: '#FF6A00',
  },
  {
    name: 'Code Samples',
    icon: Code,
    count: 230,
    color: '#FFE0CC',
  },
  {
    name: 'Software Tools',
    icon: Download,
    count: 46,
    color: '#D4E6F2',
  },
  {
    name: 'Practice Projects',
    icon: Layers,
    count: 37,
    color: '#FF6A00',
  },
];

const ResourcesSection = () => {
  const reduce = useReducedMotion();

  return (
    <section id="resources" className="bg-white px-4 pb-24 pt-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1400px]">
        <Reveal className="mb-8 rounded-[2rem] bg-[#0A1628] p-8 text-white sm:p-10">
          <p className="landing-mono mb-4 text-sm text-[#FF6A00]">For School of ICT students</p>
          <h2 className="max-w-2xl text-4xl font-bold sm:text-5xl">
            Shared resources for the community
          </h2>
          <p className="mt-4 max-w-xl text-white/70">
            Notes, tools, and practice materials to support your semester—put together for ITCA
            members across the School of ICT.
          </p>
        </Reveal>

        <motion.div
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          variants={reduce ? undefined : stagger}
          initial={reduce ? false : 'hidden'}
          whileInView={reduce ? undefined : 'show'}
          viewport={{ once: true, amount: 0.15 }}
        >
          {resourceCategories.map((category) => {
            const Icon = category.icon;
            const onAccent = category.color === '#FF6A00' || category.color === '#005080';
            return (
              <motion.div
                key={category.name}
                variants={reduce ? undefined : fadeUp}
                transition={{ duration: 0.55, ease: easeOut }}
                whileHover={reduce ? undefined : { y: -6, scale: 1.01 }}
                className="flex min-h-[180px] flex-col justify-between rounded-[2rem] p-6"
                style={{ backgroundColor: category.color }}
              >
                <div className="flex items-start justify-between">
                  <Icon className={`h-6 w-6 ${onAccent ? 'text-white' : 'text-[#0A1628]'}`} />
                  <Lock className={`h-4 w-4 ${onAccent ? 'text-white/70' : 'text-[#0A1628]/60'}`} />
                </div>
                <div>
                  <p className={`text-4xl font-extrabold ${onAccent ? 'text-white' : 'text-[#0A1628]'}`}>
                    {category.count}+
                  </p>
                  <h3 className={`mt-2 text-lg font-bold ${onAccent ? 'text-white' : 'text-[#0A1628]'}`}>
                    {category.name}
                  </h3>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default ResourcesSection;
