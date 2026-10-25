import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown } from 'lucide-react';

export default function HeroSection() {
  return (
    <section
      id="hero-banner"
      aria-labelledby="hero-heading"
      className="relative isolate flex min-h-[85svh] items-end overflow-hidden rounded-b-[2rem] bg-[#005080] itca-blue-surface px-5 pb-16 pt-32 sm:rounded-b-[3rem] sm:px-10 sm:pb-20 lg:min-h-[95svh] lg:rounded-b-[4rem] lg:px-16 lg:pb-24"
    >
      <Image
        fill
        priority
        quality={92}
        src="/IMG_4410.jpg"
        alt="ITCA students together at the University of The Gambia"
        sizes="100vw"
        className="-z-20 object-cover object-[center_35%]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-[#005080]/95 via-[#005080]/45 to-[#005080]/20"
      />
      <div className="mx-auto w-full max-w-[1400px] text-white">
        <p className="mb-5 text-base font-medium tracking-wide sm:text-lg">
          ITCA · University of The Gambia
        </p>
        <h1
          id="hero-heading"
          className="max-w-4xl text-5xl font-semibold leading-[1.12] sm:text-6xl md:text-7xl lg:text-8xl"
        >
          A community to learn,
          <br className="hidden sm:block" /> connect and grow.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/95 sm:text-xl sm:leading-9">
          Find study materials, manage your ITCA dues and discover what’s happening in your School
          of ICT community.
        </p>
        <Link
          href="#student-services-heading"
          className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-full bg-white px-6 py-3 text-base font-semibold text-[#005080] transition hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          Explore what you can do
          <ArrowDown aria-hidden="true" className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}
