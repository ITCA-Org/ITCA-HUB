import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { Instagram, X } from 'lucide-react';
import { SOCIAL_LINKS } from './brand';
import usePublicReducedMotion from '@/hooks/use-public-reduced-motion';
import { FacebookMark, LinkedinMark } from './social-icons';

const links = [
  { label: 'Home', href: '/' },
  { label: 'Resources', href: '/resources' },
  { label: 'Events', href: '/events' },
  { label: 'Shop', href: '/shop' },
  { label: 'Donate', href: '/donate' },
  { label: 'Pay dues', href: '/fees' },
];

type HeaderProps = { homeHero?: boolean };

export default function Header(_props: HeaderProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const reduceMotion = usePublicReducedMotion();
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const close = () => setOpen(false);
    router.events.on('routeChangeStart', close);
    return () => router.events.off('routeChangeStart', close);
  }, [router.events]);

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const desktop = window.matchMedia('(min-width: 1024px)');
    const resize = () => {
      if (desktop.matches) setOpen(false);
    };
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', escape);
    desktop.addEventListener('change', resize);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('keydown', escape);
      desktop.removeEventListener('change', resize);
    };
  }, [open]);

  const active = (href: string) => {
    if (href === '/resources')
      return ['/resources', '/past-papers', '/course-outlines'].some(
        (path) => router.pathname === path || router.pathname.startsWith(`${path}/`)
      );
    return router.pathname === href || (href !== '/' && router.pathname.startsWith(`${href}/`));
  };

  return (
    <header
      ref={header}
      className="fixed inset-x-0 top-0 z-50 border-b border-[#005080]/15 bg-white itca-white-surface text-[#005080]"
    >
      <a
        href="#main-content"
        className="absolute left-4 top-2 z-[60] -translate-y-24 rounded-lg bg-[#005080] px-5 py-3 font-semibold text-white focus:translate-y-0"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-20 max-w-[1528px] items-center justify-between gap-4 px-5 sm:px-10 lg:px-16">
        <Link
          href="/"
          aria-label="ITCA Hub home"
          className="inline-flex min-h-11 shrink-0 items-center"
        >
          <Image
            priority
            width={180}
            height={46}
            src="/itca-logo.png"
            alt="ITCA"
            className="h-9 w-auto object-contain sm:h-11"
          />
        </Link>
        <button
          ref={toggle}
          type="button"
          aria-controls="main-navigation"
          aria-expanded={open}
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-[#005080] transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005080] lg:hidden"
        >
          {open ? (
            <X aria-hidden="true" className="h-7 w-7" />
          ) : (
            <span aria-hidden="true" className="flex w-7 flex-col items-end gap-[5px]">
              <span className="h-[2px] w-7 rounded-full bg-current" />
              <span className="h-[2px] w-5 rounded-full bg-current" />
              <span className="h-[2px] w-3.5 rounded-full bg-current" />
            </span>
          )}
        </button>
        <nav
          id="main-navigation"
          aria-label="Main navigation"
          className={`${open ? 'flex' : 'hidden'} absolute inset-x-0 top-full flex-col border-b border-[#005080]/15 bg-white px-5 pb-5 pt-3 shadow-[0_16px_28px_rgba(0,40,70,0.12)] sm:px-10 lg:static lg:flex lg:flex-row lg:items-center lg:gap-2 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none`}
        >
          <p className="px-4 pb-2 pt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#005080]/60 lg:hidden">
            Explore ITCA
          </p>
          <ul className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-2">
            {links.map(({ label, href }) => (
              <li
                key={href}
                style={
                  open && !reduceMotion
                    ? { animationDelay: `${links.findIndex((link) => link.href === href) * 45}ms` }
                    : undefined
                }
                className={open && !reduceMotion ? 'mobile-nav-item' : undefined}
              >
                <Link
                  href={href}
                  aria-current={active(href) ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                  className={`inline-flex min-h-12 w-full items-center px-4 text-lg font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005080] lg:min-h-11 lg:w-auto lg:text-base ${href === '/fees' ? 'rounded-full bg-[#005080] text-white hover:bg-[#003e63]' : 'rounded-xl text-[#005080] hover:bg-[#005080]/5 lg:rounded-lg'}`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <ul
            aria-label="ITCA social media"
            className={`mt-3 flex items-center gap-2 border-t border-[#005080]/15 px-3 pt-3 lg:hidden ${open && !reduceMotion ? 'mobile-nav-item' : ''}`}
          >
            <li>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="ITCA on Instagram (opens in a new tab)"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-[#005080] transition-colors hover:bg-[#005080]/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005080]"
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
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-[#005080] transition-colors hover:bg-[#005080]/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005080]"
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
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-[#005080] transition-colors hover:bg-[#005080]/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005080]"
              >
                <LinkedinMark className="h-5 w-5" />
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
