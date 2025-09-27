import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Facebook, Instagram, Mail, Linkedin } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  // Check if window width is below 1050px
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1050);
    };

    // Initial check
    checkMobile();

    // Add event listener
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle scroll effect and section tracking
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Set up intersection observer for each section
    const sections = document.querySelectorAll('section[id]');
    const observerOptions = {
      root: null,
      rootMargin: '-100px 0px -100px 0px',
      threshold: 0.3,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  // Helper function to determine if a link is active
  const isActive = (sectionId: string) => {
    return activeSection === sectionId ? 'link-active' : '';
  };

  const navLinks = [
    { name: 'Home', href: '#hero-section' },
    { name: 'Events', href: '#events' },
    { name: 'Degrees', href: '#degrees' },
    { name: 'Virtual Tour', href: '#virtual-tour' },
    { name: 'Resources', href: '#resources' },
  ];

  return (
    <header
      className={`fixed left-0 top-0 sm:px-0 lg:px-15 z-50 w-full transition-all duration-300 ${
        isScrolled ? 'bg-white py-2 shadow-lg shadow-blue-700/5' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link href="/" className="relative z-50 flex items-center">
          <Image
            priority
            width={120}
            height={40}
            alt="ITCA Logo"
            src="/images/logo.jpg"
            className="h-auto w-28"
          />
        </Link>

        {/*==================== Desktop Menu (Visible above 1050px) ====================*/}
        {!isMobile && (
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className={`font-medium transition-colors ${
                      isScrolled
                        ? 'text-gray-900 hover:text-[#1d4ed8]'
                        : 'text-white hover:text-[#f59e0b]'
                    } ${isActive(link.href.substring(1))}`}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
        {/*==================== End of Desktop Menu (Visible Above 1050px) ====================*/}

        {/*==================== Sign In/Up buttons - Always Visible on Desktop ====================*/}
        <div className="hidden md:flex gap-2">
          <Link
            href="/auth"
            className={`rounded-full px-6 py-2 font-medium transition-all ${
              isScrolled
                ? 'text-gray-800 hover:bg-[#1d4ed8] hover:text-white'
                : 'text-white hover:bg-white/20'
            }`}
          >
            Sign in
          </Link>
          <Link
            href="/auth/sign-up"
            className={`rounded-full px-6 py-2 font-medium transition-all ${
              isScrolled
                ? 'bg-[#1d4ed8] text-white hover:bg-[#1e40af]'
                : 'bg-white/10 text-white backdrop-blur-sm hover:bg-white/20'
            }`}
          >
            Sign Up
          </Link>
        </div>
        {/*==================== End of Sign In/Up buttons - Always Visible on Desktop ====================*/}

        {/*==================== Mobile Menu Toggle Button ====================*/}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm md:hidden"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className={`h-6 w-6 ${isScrolled ? 'text-gray-900' : 'text-white'}`} />
          ) : (
            <Menu className={`h-6 w-6 ${isScrolled ? 'text-gray-900' : 'text-white'}`} />
          )}
        </button>
        {/*==================== End of Mobile Menu Toggle Button ====================*/}

        {/*==================== Mobile Menu ====================*/}
        {isMenuOpen && !isMobile && (
          <div className="absolute left-0 top-full w-full bg-white py-4 shadow-lg md:hidden">
            <nav className="container mx-auto px-4">
              <ul className="space-y-4">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className={`block font-medium text-gray-900 hover:text-[#1d4ed8] ${isActive(
                        link.href.substring(1)
                      )}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
                <li className="pt-4 space-y-2">
                  <Link
                    href="/auth"
                    className="block w-full rounded-full px-6 py-2 font-medium text-gray-800 transition-all hover:bg-[#1d4ed8] hover:text-white text-center"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/sign-up"
                    className="block w-full rounded-full bg-[#1d4ed8] px-6 py-2 font-medium text-white transition-all hover:bg-[#1e40af] text-center"
                  >
                    Sign up
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        )}
        {/*==================== End of Mobile Menu ====================*/}

        {/*==================== Mobile Menu with Animations Oonly on Screens Below 1050px) ====================*/}
        <AnimatePresence>
          {isMenuOpen && isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="fixed inset-0 bg-gray-900/95 backdrop-blur-md z-40"
            >
              <button
                aria-label="Close menu"
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-700/50 text-white hover:bg-gray-600/50 transition-all z-50"
              >
                <X className="h-6 w-6" />
              </button>
              <motion.nav
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{
                  type: 'spring',
                  stiffness: 100,
                  damping: 20,
                }}
                className="fixed inset-y-0 right-0 w-full max-w-sm bg-gray-800/50 backdrop-blur-xl border-l border-gray-700/50 flex flex-col justify-center"
              >
                <div className="px-8">
                  <ul className="space-y-6">
                    {navLinks.map((link) => (
                      <motion.li
                        key={link.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: navLinks.indexOf(link) * 0.1,
                          duration: 0.3,
                        }}
                      >
                        <a
                          href={link.href}
                          className={`text-xl text-white hover:text-[#f59e0b] transition-colors duration-300 ${isActive(link.href.substring(1))}`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {link.name}
                        </a>
                      </motion.li>
                    ))}
                    <motion.li
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: navLinks.length * 0.1,
                        duration: 0.3,
                      }}
                    >
                      <Link
                        href="/auth"
                        className="text-xl text-white hover:text-[#f59e0b] transition-colors duration-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                    </motion.li>
                  </ul>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (navLinks.length + 1) * 0.1 }}
                    className="mt-12 flex flex-col space-y-4"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-[#1d4ed8]/20 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-[#1d4ed8]" />
                      </div>
                      <span className="text-gray-300 text-sm">itca@utg.edu.gm</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-[#f59e0b]/20 flex items-center justify-center">
                        <svg
                          className="h-5 w-5 text-[#f59e0b]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-300 text-sm">Faraba Banta Campus</span>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: (navLinks.length + 2) * 0.1 }}
                    className="mt-12 flex space-x-4"
                  >
                    <a
                      href="https://www.facebook.com/share/1GUd1gGihV/?mibextid=wwXIfr"
                      className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-white hover:bg-[#1d4ed8] transition-colors duration-300"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>
                    <a
                      href="https://www.instagram.com/utgitca?igsh=MTRwcTF4amRuZ2x0YQ=="
                      className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-white hover:bg-[#1d4ed8] transition-colors duration-300"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                    <a
                      href="https://gm.linkedin.com/company/utg-itca-information-technology-communication-association-university-of-the-gambia"
                      className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-white hover:bg-[#1d4ed8] transition-colors duration-300"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  </motion.div>
                </div>
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>
        {/*==================== End of Mobile Menu with Animations (Only on Screens Below 1050px) ====================*/}
      </div>
    </header>
  );
};

export default Header;
