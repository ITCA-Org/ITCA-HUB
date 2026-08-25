import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import HomeIcon from './home-icon';

const navLinks = [
  { name: 'Home', href: '/', match: '/' },
  { name: 'Events', href: '/events', match: '/events' },
  { name: 'Resources', href: '/resources', match: '/resources' },
  { name: 'Shop', href: '/shop', match: '/shop' },
  { name: 'Fees', href: '/fees', match: '/fees' },
];

const desktopNavLinks = navLinks.filter((link) => link.name !== 'Home');

type HeaderProps = {
  /** When true, nav starts transparent over the hero and turns solid after scroll */
  homeHero?: boolean;
};

const Header = ({ homeHero = false }: HeaderProps) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSolidNav, setShowSolidNav] = useState(!homeHero);

  useEffect(() => {
    if (!homeHero) {
      setShowSolidNav(true);
      return;
    }

    const banner = document.getElementById('hero-banner');
    if (!banner) {
      setShowSolidNav(true);
      return;
    }

    const updateNav = () => {
      const { bottom } = banner.getBoundingClientRect();
      setShowSolidNav(bottom <= 0);
    };

    updateNav();
    window.addEventListener('scroll', updateNav, { passive: true });
    window.addEventListener('resize', updateNav);

    return () => {
      window.removeEventListener('scroll', updateNav);
      window.removeEventListener('resize', updateNav);
    };
  }, [homeHero]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const close = () => setIsMenuOpen(false);
    router.events.on('routeChangeStart', close);
    return () => router.events.off('routeChangeStart', close);
  }, [router.events]);

  const isActive = (match: string) => {
    if (match === '/') return router.pathname === '/';
    if (match === '/resources') {
      return (
        router.pathname === '/resources' ||
        router.pathname.startsWith('/resources/') ||
        router.pathname === '/past-papers' ||
        router.pathname.startsWith('/past-papers/')
      );
    }
    return router.pathname === match || router.pathname.startsWith(`${match}/`);
  };

  const Logo = ({ className = 'h-9 w-auto object-contain md:h-14' }: { className?: string }) => (
    <Link href="/" className="flex items-center">
      <Image
        priority
        width={220}
        height={56}
        alt="ITCA logo"
        src="/itca-logo.png"
        className={className}
      />
    </Link>
  );

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div
        className={`pointer-events-none px-4 transition-[padding] duration-300 md:hidden ${
          isMenuOpen ? 'relative z-[60]' : ''
        }`}
      >
        <div
          className={`pointer-events-auto flex h-[56px] w-full items-center justify-between transition-all duration-300 ${
            showSolidNav && !isMenuOpen
              ? 'rounded-b-[1.5rem] bg-white px-3 shadow-[0_8px_28px_rgba(0,0,0,0.12)]'
              : 'bg-transparent px-0 pt-1'
          }`}
        >
          <button
            type="button"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
            className={`rounded-full px-5 py-1.5 text-sm font-semibold tracking-tight transition ${
              isMenuOpen ? 'bg-[#0A1628] text-white' : 'bg-[#0A1628] text-[#FF6A00]'
            }`}
          >
            {isMenuOpen ? 'Close' : 'Menu'}
          </button>
          <Logo className="h-8 w-auto object-contain" />
        </div>
      </div>

      <div
        className={`pointer-events-none hidden transition-[padding] duration-300 md:block ${
          showSolidNav ? 'px-6 sm:px-10 lg:px-16' : 'px-8 sm:px-14 lg:px-24'
        }`}
      >
        <div
          className={`pointer-events-auto mx-auto flex h-[88px] w-full max-w-[1400px] items-center justify-between transition-all duration-300 ${
            showSolidNav
              ? 'rounded-b-[3rem] bg-white px-8 shadow-[0_8px_28px_rgba(0,0,0,0.12)]'
              : 'bg-transparent px-0'
          }`}
        >
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/"
              aria-label="Home"
              aria-current={isActive('/') ? 'page' : undefined}
              className={`flex h-11 w-14 shrink-0 items-center justify-center rounded-[14px] transition ${
                isActive('/')
                  ? 'bg-[#FF6A00] text-white'
                  : 'bg-[#0A1628] text-[#FF6A00] hover:bg-[#FF6A00] hover:text-white'
              }`}
            >
              <HomeIcon className="h-6 w-6" />
            </Link>

            <nav className="flex items-center gap-2.5">
              {desktopNavLinks.map((link) => {
                const active = isActive(link.match);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`inline-flex h-11 shrink-0 items-center justify-center whitespace-nowrap rounded-full px-6 text-base font-semibold leading-none transition lg:px-8 lg:text-lg ${
                      active
                        ? 'bg-[#FF6A00] text-white'
                        : 'bg-[#0A1628] text-[#FF6A00] hover:bg-[#FF6A00] hover:text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <Logo />
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto fixed inset-0 z-[55] bg-[#005080] md:hidden"
          >
            <nav className="flex h-full flex-col justify-center gap-3 px-5 pb-16 pt-20">
              {navLinks.map((link) => {
                const active = isActive(link.match);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`inline-flex h-10 w-fit min-w-[10rem] items-center justify-center whitespace-nowrap rounded-full px-8 text-center text-lg font-semibold leading-none tracking-tight transition ${
                      active ? 'bg-[#FF6A00] text-white' : 'bg-[#0A1628] text-[#FF6A00]'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
