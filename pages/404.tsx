import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import LandingLayout from '@/components/landing-page/landing-layout';
import { CONTACT_MAIL, darkCtaClass } from '@/components/landing-page/brand';
import { easeOut } from '@/components/landing-page/reveal';

const highlights = [
  {
    href: '/events',
    title: 'Events that bring campus together',
    image: '/ITCA_WEEK/IMG_4608.jpg',
    alt: 'ITCA Week gathering on campus',
  },
  {
    href: '/community',
    title: 'Community that learns, plays, and belongs',
    image: '/ITCA_SPORTS/IMG_8179.jpg',
    alt: 'ITCA sports on campus',
  },
  {
    href: '/resources',
    title: 'Resources shared for School of ICT students',
    image: '/ITCA_BOOTCAMP/IMG_8789.jpg',
    alt: 'ITCA bootcamp students collaborating',
  },
];

const NotFoundPage = () => {
  const reduce = useReducedMotion();

  return (
    <LandingLayout
      path="/404"
      title="Page Not Found | ITCA Hub"
      description="The page you were looking for doesn’t exist. Explore ITCA events, community, and resources instead."
      showFloatingCta={false}
    >
      <section className="bg-white px-5 pb-10 pt-28 sm:px-10 lg:px-16 lg:pb-14 lg:pt-36">
        <div className="mx-auto max-w-[1400px]">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: easeOut }}
          >
            <span className="inline-flex rounded-full bg-[#FF6A00] px-3.5 py-1 text-sm font-bold tracking-wide text-[#0A1628]">
              404
            </span>

            <h1 className="mt-8 max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight text-[#0A1628] sm:text-5xl md:text-6xl lg:text-7xl">
              Oops! The page you were looking for doesn&apos;t exist!
            </h1>

            <h2 className="mt-12 text-xl font-semibold text-[#0A1628] sm:mt-16 sm:text-2xl lg:text-3xl">
              Have a look at some recent highlights
            </h2>
          </motion.div>
        </div>
      </section>

      <section className="relative w-full">
        <div className="relative min-h-[48svh] w-full overflow-hidden rounded-t-[2rem] sm:min-h-[58svh] sm:rounded-t-[2.5rem] lg:min-h-[68svh]">
          <Image
            fill
            priority
            alt="ITCA students together at a retreat"
            src="/ITCA_RETREAT/retreat-gathering.jpg"
            className="object-cover object-[center_35%]"
            sizes="100vw"
          />

          <div className="absolute inset-x-0 bottom-0 flex justify-end p-4 sm:p-6 lg:p-8">
            <a
              href={CONTACT_MAIL}
              className={`${darkCtaClass} max-w-full text-left shadow-lg sm:px-6`}
            >
              <span className="whitespace-normal">
                Want to get involved?{' '}
                <span className="underline underline-offset-4">Say hello!</span>
              </span>
            </a>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-10 lg:px-16 lg:py-24">
        <div className="mx-auto grid max-w-[1400px] gap-8 md:grid-cols-3 md:gap-6 lg:gap-8">
          {highlights.map((item, index) => (
            <motion.div
              key={item.href}
              initial={reduce ? false : { opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.65, delay: reduce ? 0 : index * 0.08, ease: easeOut }}
            >
              <Link href={item.href} className="group block">
                <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-[1.5rem] sm:rounded-[2rem]">
                  <Image
                    fill
                    alt={item.alt}
                    src={item.image}
                    className="object-cover transition duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <h3 className="text-xl font-bold leading-snug text-[#0A1628] transition group-hover:text-[#005080] sm:text-2xl">
                  {item.title}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-[1400px]">
          <Link href="/" className={darkCtaClass}>
            Back to home
          </Link>
        </div>
      </section>
    </LandingLayout>
  );
};

export default NotFoundPage;
