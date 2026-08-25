'use client';

import { animate, motion, useInView, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import { ReactNode, useEffect, useRef } from 'react';

export const easeOut = [0.22, 1, 0.36, 1] as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1 },
};

export const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.08 },
  },
};

type RevealProps = HTMLMotionProps<'div'> & {
  children: ReactNode;
  delay?: number;
  y?: number;
  once?: boolean;
  amount?: number;
};

/** Scroll-triggered fade/slide — respects reduced motion */
export const Reveal = ({
  children,
  className,
  delay = 0,
  y = 28,
  once = true,
  amount = 0.25,
  ...rest
}: RevealProps) => {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.7, delay, ease: easeOut }}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

type CountUpProps = {
  to: number;
  suffix?: string;
  className?: string;
  duration?: number;
};

/** Animates a number when it scrolls into view */
export const CountUp = ({ to, suffix = '', className, duration = 1.4 }: CountUpProps) => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  useEffect(() => {
    if (reduce || !inView || !ref.current) return;
    const controls = animate(0, to, {
      duration,
      ease: easeOut,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [duration, inView, reduce, suffix, to]);

  if (reduce) {
    return (
      <span className={className}>
        {to}
        {suffix}
      </span>
    );
  }

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  );
};
