import Link from 'next/link';
import { ArrowRight, Instagram } from 'lucide-react';
import { CONTACT_MAIL, SOCIAL_LINKS } from './brand';
import FlyingButterfly from './flying-butterfly';
import { FacebookMark, LinkedinMark } from './social-icons';

const Footer = () => {
  return (
    <footer className="bg-[#005080] itca-blue-surface text-white">
      <div className="flex flex-col items-start justify-between gap-2 bg-[#005080] itca-blue-surface px-5 py-4 text-sm sm:flex-row sm:items-center sm:gap-4 sm:px-10 lg:px-16">
        <Link
          href="/events"
          className="font-medium text-white underline decoration-white underline-offset-4"
        >
          See what&apos;s coming up <span aria-hidden>→</span>
        </Link>
        <p className="text-[var(--itca-accent-ink)] sm:ml-auto sm:mr-0 lg:mr-auto">
          Bootcamps, sports & campus life
        </p>
        <Link
          href="/community"
          className="hidden font-medium text-white underline decoration-white underline-offset-4 md:inline"
        >
          About the community <span aria-hidden>→</span>
        </Link>
      </div>

      <div className="relative overflow-hidden bg-[#005080] itca-blue-surface px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-12 text-white sm:px-10 sm:pb-10 sm:pt-16 lg:px-16 lg:pb-12 lg:pt-20">
        <FlyingButterfly />

        <div className="relative z-10 mx-auto max-w-[1400px]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-4xl">
              <h2 className="text-4xl font-bold leading-[1.12] sm:text-5xl md:text-6xl">
                Got feedback on ITCA or campus life? Tell us.
              </h2>
              <a
                href={CONTACT_MAIL}
                className="mt-6 inline-flex min-h-11 items-center gap-2 text-lg font-semibold underline decoration-2 underline-offset-8 sm:mt-7"
              >
                Email ITCA
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-6 border-t border-white/30 pt-6 sm:mt-16 sm:flex-row sm:items-end sm:justify-between sm:gap-8 sm:pt-7">
            <nav aria-label="ITCA social media">
              <ul className="flex flex-wrap items-center gap-3">
                <li>
                  <a
                    href={SOCIAL_LINKS.instagram}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="ITCA on Instagram (opens in a new tab)"
                    className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/40 text-white transition hover:bg-white hover:text-[#005080] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <Instagram aria-hidden="true" className="h-5 w-5" />
                  </a>
                </li>
                <li>
                  <a
                    href={SOCIAL_LINKS.facebook}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="ITCA on Facebook (opens in a new tab)"
                    className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/40 text-white transition hover:bg-white hover:text-[#005080] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <FacebookMark className="h-5 w-5" />
                  </a>
                </li>
                <li>
                  <a
                    href={SOCIAL_LINKS.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="ITCA on LinkedIn (opens in a new tab)"
                    className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/40 text-white transition hover:bg-white hover:text-[#005080] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <LinkedinMark className="h-5 w-5" />
                  </a>
                </li>
              </ul>
            </nav>

            <div className="flex flex-wrap items-end gap-x-6 gap-y-3 text-sm font-semibold sm:gap-x-8">
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

          <div className="mt-7 flex flex-col gap-4 border-t border-white/20 pt-5 text-sm sm:mt-8 sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:pt-6 lg:items-center">
            <p suppressHydrationWarning>
              © {new Date().getFullYear()} ITCA · School of ICT · UTG ·{' '}
              <a href={CONTACT_MAIL} className="underline underline-offset-4">
                itca@utg.edu.gm
              </a>
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-3 sm:max-w-[52rem] sm:justify-end">
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
