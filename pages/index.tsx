import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import { useEffect } from 'react';
import { UserAuth } from '@/types';
import { NextApiRequest } from 'next';
import { isLoggedIn } from '@/utils/auth';
import { BASE_URL } from '@/utils/url';
import { SITE_URL } from '@/utils/site';
import Footer from '../components/landing-page/footer';
import Header from '../components/landing-page/header';
import VirtualTour from '../components/landing-page/virtual-tour';
import HeroSection from '../components/landing-page/hero-section';
import EventsSection, { Event } from '../components/landing-page/events-section';
import DegreesSection from '../components/landing-page/degrees-section';
import ResourcesSection from '../components/landing-page/resources-section';

const PAGE_TITLE = 'ITCA Hub | Where Technology Meets Community';
const PAGE_DESCRIPTION =
  'Information Technology Communication Association under the School of Information Communication and Technology';
const OG_IMAGE = `${SITE_URL}/images/logo.jpg`;

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ITCA Hub',
  url: SITE_URL,
  logo: OG_IMAGE,
  description: PAGE_DESCRIPTION,
  sameAs: [
    'https://www.facebook.com/share/1GUd1gGihV/?mibextid=wwXIfr',
    'https://www.instagram.com/utgitca?igsh=MTRwcTF4amRuZ2x0YQ==',
    'https://gm.linkedin.com/company/utg-itca-information-technology-communication-association-university-of-the-gambia',
  ],
};

interface HomePageProps {
  initialEvents?: Event[];
}

const HomePage = ({ initialEvents }: HomePageProps) => {
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
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <meta name="keywords" content="ITCA HUB, Itca hub, ITCA, UTG ITCA, UTG" />
        <meta
          name="google-site-verification"
          content="cYtk4C3rxSxsbweqGDktZcyXjEQLFbmShStbGJPmq44"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={`${SITE_URL}/`} />
        <link rel="icon" href="/images/logo.jpg" />

        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:url" content={`${SITE_URL}/`} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:site_name" content="ITCA Hub" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} />
        <meta name="twitter:image" content={OG_IMAGE} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />

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
          <EventsSection initialEvents={initialEvents} />
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

  let initialEvents: Event[] = [];

  try {
    const response = await axios.get(`${BASE_URL}/events/upcoming?page=1&limit=6`);

    if (response.data.status === 'success') {
      initialEvents = response.data.data;
    }
  } catch {
    // Events are optional for the homepage; client can retry if needed.
  }

  return {
    props: {
      userData: false,
      initialEvents,
    },
  };
};
