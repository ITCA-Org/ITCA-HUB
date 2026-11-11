import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import usePublicReducedMotion from '@/hooks/use-public-reduced-motion';

const services = [
  {
    title: 'Find study materials',
    description: 'Past papers, course outlines and tools for your studies.',
    href: '/resources',
    action: 'Browse resources',
    image: '/ITCA_WEEK/IMG_4608.jpg',
    alt: 'School of ICT students studying and collaborating',
    secondaryHref: '/past-papers',
    secondaryLabel: 'Go straight to past papers',
  },
  {
    title: 'Manage your ITCA dues',
    description: 'Pay D50 for a semester or check what you have already paid.',
    href: '/fees',
    action: 'Pay dues',
    image: '/fees/install.jpg',
    alt: 'Making a semester payment on a phone',
    secondaryHref: '/fees#fee-status',
    secondaryLabel: 'Check my balance',
  },
  {
    title: 'Join an upcoming event',
    description: 'Find workshops, sports and campus activities. See details and tickets.',
    href: '/events',
    action: 'Explore events',
    image: '/ITCA_WEEK/IMG_4517.jpg',
    alt: 'ITCA students together at a campus event',
    secondaryHref: '/shop',
    secondaryLabel: 'Looking for ITCA merchandise?',
  },
];

export default function StudentServices() {
  const reduceMotion = usePublicReducedMotion();
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel || reduceMotion) return;

    const cards = Array.from(carousel.children) as HTMLElement[];
    if (cards.length < 2) return;

    let activeIndex = 0;
    let visible = false;
    let pausedUntil = 0;
    let hoverPaused = false;
    let focusPaused = false;

    const syncIndex = () => {
      const carouselLeft = carousel.getBoundingClientRect().left;
      let nearestIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;
      cards.forEach((card, index) => {
        const cardLeft = card.getBoundingClientRect().left - carouselLeft;
        const distance = Math.abs(cardLeft);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });
      activeIndex = nearestIndex;
    };

    const pauseAfterInteraction = () => {
      pausedUntil = Date.now() + 7000;
    };
    const pause = () => {
      hoverPaused = true;
    };
    const resume = () => {
      hoverPaused = false;
    };
    const onFocusIn = () => {
      focusPaused = true;
    };
    const onFocusOut = (event: FocusEvent) => {
      if (!carousel.contains(event.relatedTarget as Node | null)) focusPaused = false;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.2 }
    );
    observer.observe(carousel);
    carousel.addEventListener('scroll', syncIndex, { passive: true });
    carousel.addEventListener('pointerdown', pauseAfterInteraction, { passive: true });
    carousel.addEventListener('mouseenter', pause);
    carousel.addEventListener('mouseleave', resume);
    carousel.addEventListener('focusin', onFocusIn);
    carousel.addEventListener('focusout', onFocusOut);

    const timer = window.setInterval(() => {
      if (!visible || document.hidden || hoverPaused || focusPaused || Date.now() < pausedUntil)
        return;
      activeIndex = (activeIndex + 1) % cards.length;
      const carouselLeft = carousel.getBoundingClientRect().left;
      const left =
        cards[activeIndex].getBoundingClientRect().left - carouselLeft + carousel.scrollLeft;
      carousel.scrollTo({ left, behavior: 'smooth' });
    }, 4500);

    return () => {
      window.clearInterval(timer);
      observer.disconnect();
      carousel.removeEventListener('scroll', syncIndex);
      carousel.removeEventListener('pointerdown', pauseAfterInteraction);
      carousel.removeEventListener('mouseenter', pause);
      carousel.removeEventListener('mouseleave', resume);
      carousel.removeEventListener('focusin', onFocusIn);
      carousel.removeEventListener('focusout', onFocusOut);
    };
  }, [reduceMotion]);

  return (
    <section
      aria-labelledby="student-services-heading"
      className="bg-white itca-white-surface px-5 pb-6 pt-6 text-[#005080] sm:px-10 sm:py-10 lg:px-16 lg:py-14"
    >
      <div className="mx-auto max-w-[1400px]">
        <h2 id="student-services-heading" className="text-3xl font-semibold sm:text-4xl">
          What do you need today?
        </h2>
        <p className="mt-1 max-w-2xl text-lg leading-7 sm:mt-3 sm:leading-8">
          Start with the essentials for your studies and student life.
        </p>
        <div className="mt-6 -mr-5 overflow-visible md:hidden sm:mr-0">
          <div
            ref={carouselRef}
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-2 pr-5 [scrollbar-width:thin] [scrollbar-color:#005080_#D4E6F2] [-webkit-overflow-scrolling:touch] sm:pr-0"
            role="region"
            aria-label="Student services cards; swipe horizontally to see all services"
            tabIndex={0}
          >
            {services.map((service, index) => (
              <ServiceCard
                key={service.href}
                service={service}
                index={index}
                mobile
                reduceMotion={reduceMotion}
              />
            ))}
          </div>
        </div>
        <div className="mt-6 hidden gap-5 md:grid md:grid-cols-3">
          {services.map((service, index) => (
            <ServiceCard
              key={service.href}
              service={service}
              index={index}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  index,
  mobile = false,
  reduceMotion,
}: {
  service: (typeof services)[number];
  index: number;
  mobile?: boolean;
  reduceMotion: boolean;
}) {
  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay: reduceMotion ? 0 : index * 0.07, ease: 'easeOut' }}
      whileHover={reduceMotion ? undefined : { y: -3 }}
      className={`flex flex-col overflow-hidden rounded-2xl border border-[#005080]/20 bg-white ${mobile ? 'w-[min(440px,calc(100vw-64px))] shrink-0 snap-start' : ''}`}
    >
      <div className={`relative bg-[#D4E6F2] ${mobile ? 'h-36' : 'h-36 sm:h-44'}`}>
        <Image
          fill
          src={service.image}
          alt={service.alt}
          sizes={mobile ? '(max-width: 767px) 84vw, 440px' : '(min-width: 768px) 33vw, 100vw'}
          className="object-cover"
        />
      </div>
      <div className={`flex flex-1 flex-col ${mobile ? 'p-4' : 'p-5 sm:p-6'}`}>
        <h3 className={`font-semibold ${mobile ? 'text-xl leading-6' : 'text-2xl'}`}>
          {service.title}
        </h3>
        <p
          className={`${mobile ? 'mb-3 mt-2 text-[15px] leading-6' : 'mb-5 mt-3 text-base leading-7'}`}
        >
          {service.description}
        </p>
        <Link
          href={service.href}
          className={`mt-auto inline-flex w-fit items-center gap-3 rounded-full bg-[#005080] font-semibold text-white hover:underline ${mobile ? 'min-h-10 px-4 py-2 text-sm' : 'min-h-11 px-5 py-3 text-base'}`}
        >
          {service.action}
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
        <Link
          href={service.secondaryHref}
          className={`mt-1 inline-flex items-center underline underline-offset-4 ${mobile ? 'min-h-9 text-sm' : 'min-h-11 text-base'}`}
        >
          {service.secondaryLabel}
        </Link>
      </div>
    </motion.article>
  );
}
