import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CONTACT_MAIL, SOCIAL_LINKS } from './brand';
import FlyingButterfly from './flying-butterfly';

const Footer = () => {
  return (
    <footer className="bg-[#141414] pb-24 text-[#0A1628]">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0A1628] px-5 py-3 text-sm sm:px-10 lg:px-16">
        <Link
          href="/events"
          className="font-medium text-white underline decoration-white underline-offset-4"
        >
          See what&apos;s coming up <span aria-hidden>→</span>
        </Link>
        <p className="text-[#FF6A00]">Bootcamps, sports & campus life</p>
        <Link
          href="/community"
          className="hidden font-medium text-white underline decoration-white underline-offset-4 md:inline"
        >
          About the community <span aria-hidden>→</span>
        </Link>
      </div>

      <div className="relative overflow-hidden bg-[#005080] px-5 py-16 text-white sm:px-10 lg:px-16 lg:py-24">
        <FlyingButterfly />

        <div className="relative z-10 mx-auto max-w-[1400px]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-4xl">
              <h2 className="text-4xl font-bold leading-[1.12] sm:text-5xl md:text-6xl">
                Got feedback on ITCA or campus life? Tell us.
              </h2>
              <a
                href={CONTACT_MAIL}
                className="mt-8 inline-flex items-center gap-2 text-lg font-semibold underline decoration-2 underline-offset-8"
              >
                Email ITCA
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="mt-24 flex flex-col gap-8 border-t border-white/30 pt-8 sm:flex-row sm:items-end sm:justify-between">
            <a
              href={SOCIAL_LINKS.linkedin}
              className="inline-flex w-fit rounded-full bg-[#0A1628] px-5 py-2.5 text-sm font-semibold text-[#FF6A00]"
            >
              LinkedIn
            </a>

            <div className="flex flex-wrap items-end gap-x-8 gap-y-3 text-sm font-semibold">
              <div>
                <p>University of</p>
                <p>The Gambia</p>
              </div>
              <div>
                <p>School of</p>
                <p>ICT</p>
              </div>
              <div>
                <p>Faraba</p>
                <p>Banta Campus</p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p suppressHydrationWarning>
              © {new Date().getFullYear()} ITCA · School of ICT · UTG ·{' '}
              <a href={CONTACT_MAIL} className="underline underline-offset-4">
                itca@utg.edu.gm
              </a>
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/events" className="underline underline-offset-4">
                Events
              </Link>
              <Link href="/degrees" className="underline underline-offset-4">
                Degrees
              </Link>
              <Link href="/community" className="underline underline-offset-4">
                Community
              </Link>
              <Link href="/resources" className="underline underline-offset-4">
                Resources
              </Link>
              <Link href="/shop" className="underline underline-offset-4">
                Shop
              </Link>
              <Link href="/fees" className="underline underline-offset-4">
                Fees
              </Link>
              <Link href="/virtual-tour" className="underline underline-offset-4">
                Virtual Tour
              </Link>
              <a href={SOCIAL_LINKS.instagram} className="underline underline-offset-4">
                Instagram
              </a>
              <a href={SOCIAL_LINKS.facebook} className="underline underline-offset-4">
                Facebook
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
