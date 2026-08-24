'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ReactNode, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Reveal, easeOut, stagger, fadeUp } from './reveal';

type Stat = {
  value: string;
  label: string;
};

type EditorialHeroProps = {
  children: ReactNode;
  stats?: Stat[];
};

/** Spacious statement + optional stats — Firefly Projects style */
export const EditorialHero = ({ children, stats }: EditorialHeroProps) => {
  const reduce = useReducedMotion();

  return (
    <section className="bg-white px-5 pb-16 pt-28 sm:px-10 lg:px-16 lg:pb-24 lg:pt-36">
      <div className="mx-auto max-w-[1400px]">
        <motion.h1
          className="max-w-5xl text-4xl font-bold leading-[1.08] tracking-tight text-[#0A1628] sm:text-5xl md:text-6xl lg:text-7xl"
          initial={reduce ? false : { opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: easeOut }}
        >
          {children}
        </motion.h1>

        {stats && stats.length > 0 && (
          <motion.div
            className="mt-16 grid gap-10 sm:grid-cols-3 sm:gap-8 lg:mt-24"
            variants={reduce ? undefined : stagger}
            initial={reduce ? false : 'hidden'}
            whileInView={reduce ? undefined : 'show'}
            viewport={{ once: true, amount: 0.35 }}
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={reduce ? undefined : fadeUp}
                transition={{ duration: 0.65, ease: easeOut }}
              >
                <p className="text-5xl font-extrabold tracking-tight text-[#0A1628] sm:text-6xl lg:text-7xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-base text-[#0A1628]/70 sm:text-lg">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

type ImmersiveImageProps = {
  src: string;
  alt: string;
  objectPosition?: string;
};

/** Full-bleed photo with subtle parallax */
export const ImmersiveImage = ({
  src,
  alt,
  objectPosition = 'object-center',
}: ImmersiveImageProps) => {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], reduce ? [1, 1, 1] : [1.08, 1, 1.04]);
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-28, 28]);

  return (
    <section ref={ref} className="relative w-full">
      <div className="relative min-h-[58svh] w-full overflow-hidden sm:min-h-[70svh] lg:min-h-[78svh]">
        <motion.div className="absolute inset-0" style={{ scale, y }}>
          <Image
            fill
            priority
            alt={alt}
            src={src}
            className={`object-cover ${objectPosition}`}
            sizes="100vw"
          />
        </motion.div>
      </div>
    </section>
  );
};

/** Small loop arrow beside a section title */
export const FeaturedHeading = ({ children }: { children: ReactNode }) => {
  const reduce = useReducedMotion();

  return (
    <Reveal className="mb-10 flex flex-col gap-6 sm:mb-14 sm:flex-row sm:items-end sm:gap-10">
      <svg
        viewBox="0 0 120 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-24 w-20 shrink-0 text-[#0A1628] sm:h-28 sm:w-24"
        aria-hidden
      >
        <motion.path
          d="M8 72 H72 C92 72 108 56 108 36 C108 16 92 4 72 4 C52 4 38 18 38 36 C38 54 54 68 72 78 L72 128"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: easeOut }}
        />
        <motion.path
          d="M56 112 C64 112 72 118 72 136"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.9, ease: easeOut }}
        />
        <motion.path
          d="M88 112 C80 112 72 118 72 136"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.9, ease: easeOut }}
        />
      </svg>
      <h2 className="text-3xl font-bold tracking-tight text-[#0A1628] sm:text-4xl md:text-5xl">
        {children}
      </h2>
    </Reveal>
  );
};

type SpotlightProps = {
  image: string;
  imageAlt: string;
  title: string;
  kicker?: string;
  tone?: string;
  ctaHref?: string;
  ctaLabel?: string;
};

/** Split image + color panel spotlight (featured project style) */
export const SpotlightCard = ({
  image,
  imageAlt,
  title,
  kicker,
  tone = '#D4E6F2',
  ctaHref = '/community',
  ctaLabel = 'Explore the community',
}: SpotlightProps) => {
  const reduce = useReducedMotion();

  return (
    <motion.article
      className="grid overflow-hidden rounded-[2rem] lg:grid-cols-2 lg:rounded-[2.5rem]"
      initial={reduce ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.75, ease: easeOut }}
    >
      <motion.div
        className="relative min-h-[280px] overflow-hidden sm:min-h-[360px] lg:min-h-[420px]"
        whileHover={reduce ? undefined : { scale: 1.02 }}
        transition={{ duration: 0.5 }}
      >
        <Image
          fill
          alt={imageAlt}
          src={image}
          className="object-cover object-center transition duration-700"
          sizes="50vw"
        />
      </motion.div>
      <div
        className="flex min-h-[280px] flex-col justify-between p-8 sm:min-h-[360px] sm:p-10 lg:min-h-[420px] lg:p-12"
        style={{ backgroundColor: tone }}
      >
        {kicker && (
          <p className="landing-mono text-sm text-[#0A1628]/70">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[#0A1628]" />
            {kicker}
          </p>
        )}
        <h3 className="mt-8 max-w-md text-3xl font-bold leading-tight text-[#0A1628] sm:text-4xl lg:text-5xl">
          {title}
        </h3>
        <motion.div whileHover={reduce ? undefined : { x: 4 }} transition={{ duration: 0.25 }}>
          <Link
            href={ctaHref}
            className="mt-10 inline-flex w-fit rounded-full bg-[#0A1628] px-5 py-2.5 text-sm font-semibold text-[#FF6A00] transition hover:brightness-110"
          >
            {ctaLabel}
          </Link>
        </motion.div>
      </div>
    </motion.article>
  );
};

type MosaicTile =
  | { type: 'image'; src: string; alt: string; className?: string }
  | {
      type: 'color';
      tone: string;
      title: string;
      kicker?: string;
      className?: string;
      lightText?: boolean;
    };

/** Asymmetric mosaic — less list-like than a plain grid */
export const EditorialMosaic = ({
  tiles,
  fullBleed = false,
}: {
  tiles: MosaicTile[];
  fullBleed?: boolean;
}) => {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={`grid auto-rows-[minmax(220px,auto)] gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-3 ${
        fullBleed ? 'w-full' : ''
      }`}
      variants={reduce ? undefined : stagger}
      initial={reduce ? false : 'hidden'}
      whileInView={reduce ? undefined : 'show'}
      viewport={{ once: true, amount: 0.15 }}
    >
      {tiles.map((tile, index) => {
        if (tile.type === 'image') {
          return (
            <motion.div
              key={`img-${index}`}
              variants={reduce ? undefined : fadeUp}
              transition={{ duration: 0.6, ease: easeOut }}
              whileHover={reduce ? undefined : { scale: 1.01 }}
              className={`relative min-h-[240px] overflow-hidden sm:min-h-[280px] lg:min-h-[320px] ${
                fullBleed ? 'rounded-none' : 'rounded-[1.75rem]'
              } ${tile.className ?? ''}`}
            >
              <Image
                fill
                alt={tile.alt}
                src={tile.src}
                className="object-cover transition duration-700 hover:scale-105"
                sizes="50vw"
              />
            </motion.div>
          );
        }

        const text = tile.lightText ? 'text-white' : 'text-[#0A1628]';
        const muted = tile.lightText ? 'text-white/75' : 'text-[#0A1628]/75';
        const dot = tile.lightText ? 'bg-white' : 'bg-[#0A1628]';

        return (
          <motion.div
            key={`color-${index}`}
            variants={reduce ? undefined : fadeUp}
            transition={{ duration: 0.6, ease: easeOut }}
            whileHover={reduce ? undefined : { y: -4 }}
            className={`flex min-h-[240px] flex-col justify-between p-7 sm:min-h-[280px] sm:p-8 lg:min-h-[320px] lg:p-10 ${
              fullBleed ? 'rounded-none' : 'rounded-[1.75rem]'
            } ${tile.className ?? ''}`}
            style={{ backgroundColor: tile.tone }}
          >
            {tile.kicker && (
              <p className={`landing-mono text-sm ${muted}`}>
                <span className={`mr-2 inline-block h-1.5 w-1.5 rounded-full ${dot}`} />
                {tile.kicker}
              </p>
            )}
            <h3 className={`max-w-md text-2xl font-bold leading-snug sm:text-3xl lg:text-4xl ${text}`}>
              {tile.title}
            </h3>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
