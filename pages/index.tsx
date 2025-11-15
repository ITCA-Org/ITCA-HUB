import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';
import { UserAuth } from '@/types';
import { NextApiRequest } from 'next';
import { isLoggedIn } from '@/utils/auth';
import Footer from '../components/landing-page/footer';
import Header from '../components/landing-page/header';
import VirtualTour from '../components/landing-page/virtual-tour';
import HeroSection from '../components/landing-page/hero-section';
import EventsSection from '../components/landing-page/events-section';
import DegreesSection from '../components/landing-page/degrees-section';
import ResourcesSection from '../components/landing-page/resources-section';

const HomePage = () => {
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');

      if (anchor) {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');

        if (targetId && targetId !== '#') {
          const targetElement = document.querySelector(targetId);

          if (targetElement) {
            window.scrollTo({
              top: targetElement.getBoundingClientRect().top + window.scrollY - 100,
              behavior: 'smooth',
            });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <>
      <Head>
        <title>ITCA Hub | Where Technology Meets Community</title>
        <meta
          name="description"
          content="Information Technology Communication Association under the School of Information Communication and Technology"
        />
        <meta name="google-site-verification" content="cYtk4C3rxSxsbweqGDktZcyXjEQLFbmShStbGJPmq44" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/logo.jpg" />
        <Link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" crossOrigin="anonymous" href="https://fonts.gstatic.com" />
        <Link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
        />
      </Head>
      <Header />

      <main className="min-h-screen font-['Inter',sans-serif]">
        <HeroSection />
        <div className="sm:px-0 lg:px-20">
          <EventsSection />
          <DegreesSection />
          <VirtualTour />
          <ResourcesSection />
        </div>
        <Footer />
      </main>
    </>
  );
};

export default HomePage;

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  const userData = isLoggedIn(req);

  if (userData && typeof userData !== 'boolean') {
    const { role } = userData as UserAuth;

    switch (role) {
      case 'admin':
        return {
          redirect: {
            destination: '/admin',
            permanent: false,
          },
        };
      case 'user':
        return {
          redirect: {
            destination: '/student',
            permanent: false,
          },
        };
      default:
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        };
    }
  }

  return {
    props: {
      userData: false,
    },
  };
};
