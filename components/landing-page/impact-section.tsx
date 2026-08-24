'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { CountUp, easeOut, fadeUp, stagger } from './reveal';

const ImpactSection = () => {
  const reduce = useReducedMotion();

  return (
    <section id="impact" className="bg-white px-4 py-16 sm:px-8 lg:px-12">
      <motion.div
        className="mx-auto grid max-w-[1400px] grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
        variants={reduce ? undefined : stagger}
        initial={reduce ? false : 'hidden'}
        whileInView={reduce ? undefined : 'show'}
        viewport={{ once: true, amount: 0.15 }}
      >
        <motion.div
          variants={reduce ? undefined : fadeUp}
          transition={{ duration: 0.65, ease: easeOut }}
          className="flex min-h-[300px] items-end rounded-[2rem] bg-[#0A1628] p-8 text-white sm:p-10 lg:min-h-[360px]"
        >
          <p className="text-3xl font-bold leading-snug sm:text-4xl lg:text-[2.75rem]">
            Here&apos;s how <span className="text-[#FF6A00]">ITCA</span> supports School of ICT
            students:
          </p>
        </motion.div>

        <motion.div
          variants={reduce ? undefined : fadeUp}
          transition={{ duration: 0.65, ease: easeOut }}
          whileHover={reduce ? undefined : { y: -6 }}
          className="flex min-h-[300px] flex-col justify-between rounded-[2rem] bg-[#005080] p-8 text-white sm:p-10 lg:min-h-[360px]"
        >
          <p className="text-6xl font-extrabold leading-none sm:text-8xl">
            <CountUp to={30} suffix="+" />
          </p>
          <p className="mt-8 max-w-sm text-base font-medium leading-relaxed sm:text-lg">
            Initiatives run each year—workshops, sports days, retreats, and campus programmes.
          </p>
        </motion.div>

        <motion.div
          variants={reduce ? undefined : fadeUp}
          transition={{ duration: 0.65, ease: easeOut }}
          className="group relative min-h-[280px] overflow-hidden rounded-[2rem] lg:min-h-[360px]"
        >
          <Image
            fill
            alt="ITCA Week students in the lecture hall"
            src="/ITCA_WEEK/IMG_4374.jpg"
            className="object-cover object-center transition duration-700 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 33vw"
          />
        </motion.div>

        <motion.div
          variants={reduce ? undefined : fadeUp}
          transition={{ duration: 0.65, ease: easeOut }}
          whileHover={reduce ? undefined : { y: -6 }}
          className="flex min-h-[300px] flex-col justify-between rounded-[2rem] bg-[#FFE0CC] p-8 text-[#0A1628] sm:p-10 lg:min-h-[360px]"
        >
          <p className="text-6xl font-extrabold leading-none sm:text-7xl">All ICT</p>
          <p className="mt-8 max-w-sm text-base font-medium leading-relaxed sm:text-lg">
            Every student in the School of ICT is an ITCA member—by being here, you belong.
          </p>
        </motion.div>

        <motion.div
          variants={reduce ? undefined : fadeUp}
          transition={{ duration: 0.65, ease: easeOut }}
          className="group relative min-h-[280px] overflow-hidden rounded-[2rem] lg:min-h-[360px]"
        >
          <Image
            fill
            alt="ITCA retreat — students connecting outdoors"
            src="/ITCA_RETREAT/KG__0265.jpg"
            className="object-cover object-center transition duration-700 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 33vw"
          />
        </motion.div>

        <motion.div
          variants={reduce ? undefined : fadeUp}
          transition={{ duration: 0.65, ease: easeOut }}
          whileHover={reduce ? undefined : { y: -6 }}
          className="relative flex min-h-[300px] flex-col justify-between overflow-hidden rounded-[2rem] bg-[#D4E6F2] p-8 text-[#0A1628] sm:p-10 lg:min-h-[360px]"
        >
          <p className="text-7xl font-extrabold leading-none sm:text-8xl">
            <CountUp to={1} />
          </p>
          <p className="mt-8 max-w-[18rem] text-base font-medium leading-relaxed sm:text-lg">
            Student community for the whole School of ICT—learning, sports, retreats, and life on
            campus.
          </p>
          <motion.div
            className="absolute bottom-4 right-4 h-28 w-28 overflow-hidden rounded-full border-[6px] border-[#D4E6F2] sm:h-32 sm:w-32"
            initial={reduce ? false : { scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.25, ease: easeOut }}
          >
            <Image
              fill
              alt="ITCA retreat gathering"
              src="/ITCA_RETREAT/KG__0414.jpg"
              className="object-cover object-center"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ImpactSection;
