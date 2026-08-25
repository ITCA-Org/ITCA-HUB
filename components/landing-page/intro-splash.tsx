'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import HomeIcon from './home-icon';

const LINE_ONE = ["You're", 'in', 'the', 'School', 'of', 'ICT.'];
const LINE_TWO = ["You're", 'already', 'ITCA.'];
const ALL_WORDS = [...LINE_ONE, ...LINE_TWO];

const NAV_PREVIEW = ['Events', 'Resources', 'Shop', 'Fees'];

type IntroSplashProps = {
  /** Fired when splash starts exiting so the page can fade in underneath */
  onReveal: () => void;
  /** Fired after the exit animation finishes */
  onComplete: () => void;
};

const IntroSplash = ({ onReveal, onComplete }: IntroSplashProps) => {
  const [visibleWords, setVisibleWords] = useState(0);
  const [showLogo, setShowLogo] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [exiting, setExiting] = useState(false);
  const onRevealRef = useRef(onReveal);
  const onCompleteRef = useRef(onComplete);
  onRevealRef.current = onReveal;
  onCompleteRef.current = onComplete;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (visibleWords >= ALL_WORDS.length) {
      const logoTimer = window.setTimeout(() => setShowLogo(true), 220);
      return () => window.clearTimeout(logoTimer);
    }

    const wordTimer = window.setTimeout(() => {
      setVisibleWords((count) => count + 1);
    }, 140);

    return () => window.clearTimeout(wordTimer);
  }, [visibleWords]);

  useEffect(() => {
    if (!showLogo) return;

    const navTimer = window.setTimeout(() => setShowNav(true), 650);
    return () => window.clearTimeout(navTimer);
  }, [showLogo]);

  useEffect(() => {
    if (!showNav) return;

    const exitTimer = window.setTimeout(() => {
      setExiting(true);
      onRevealRef.current();
    }, 550);
    return () => window.clearTimeout(exitTimer);
  }, [showNav]);

  useEffect(() => {
    if (!exiting) return;

    const doneTimer = window.setTimeout(() => {
      document.body.style.overflow = '';
      onCompleteRef.current();
    }, 450);

    return () => window.clearTimeout(doneTimer);
  }, [exiting]);

  return (
    <AnimatePresence>
      {!exiting ? (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[100] flex flex-col bg-[#005080] px-5 pt-6 sm:px-10 lg:px-16"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: '-8%' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between">
            <div className="flex min-h-[58px] items-center gap-1.5 sm:min-h-[64px] sm:gap-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={showNav ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.25 }}
                className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#FF6A00] text-white sm:h-12 sm:w-12"
              >
                <HomeIcon className="h-[18px] w-[18px]" />
              </motion.div>

              <nav className="hidden items-center gap-1.5 md:flex">
                {NAV_PREVIEW.map((item, index) => (
                  <motion.span
                    key={item}
                    initial={{ opacity: 0, y: -8 }}
                    animate={showNav ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, delay: showNav ? index * 0.05 : 0 }}
                    className="inline-flex h-11 items-center justify-center rounded-full bg-[#0A1628] px-5 text-[15px] font-semibold text-[#FF6A00] sm:h-12"
                  >
                    {item}
                  </motion.span>
                ))}
              </nav>
            </div>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={showLogo ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                priority
                width={180}
                height={48}
                alt="ITCA logo"
                src="/itca-logo.png"
                className="h-9 w-auto object-contain sm:h-11"
              />
            </motion.div>
          </div>

          <div className="flex flex-1 items-center pb-16">
            <h1 className="max-w-5xl text-4xl font-bold leading-[1.08] text-white sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="block">
                {LINE_ONE.map((word, index) => {
                  const isVisible = index < visibleWords;
                  return (
                    <motion.span
                      key={`l1-${word}-${index}`}
                      className="mr-[0.28em] inline-block"
                      initial={{ opacity: 0, y: 14 }}
                      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                    >
                      {word}
                    </motion.span>
                  );
                })}
              </span>
              <span className="mt-1 block">
                {LINE_TWO.map((word, index) => {
                  const globalIndex = LINE_ONE.length + index;
                  const isVisible = globalIndex < visibleWords;
                  const underline = word === 'ITCA.';
                  return (
                    <motion.span
                      key={`l2-${word}-${index}`}
                      className={`mr-[0.28em] inline-block ${
                        underline ? 'underline decoration-2 underline-offset-8' : ''
                      }`}
                      initial={{ opacity: 0, y: 14 }}
                      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                    >
                      {word}
                    </motion.span>
                  );
                })}
              </span>
            </h1>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default IntroSplash;
