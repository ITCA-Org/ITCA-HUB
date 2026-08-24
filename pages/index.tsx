import Head from 'next/head';
import axios from 'axios';
import { useState } from 'react';
import { UserAuth } from '@/types';
import { NextApiRequest } from 'next';
import { isLoggedIn } from '@/utils/auth';
import { BASE_URL } from '@/utils/url';
import { SITE_URL } from '@/utils/site';
import Footer from '../components/landing-page/footer';
import Header from '../components/landing-page/header';
import VirtualTour from '../components/landing-page/virtual-tour';
import HeroSection from '../components/landing-page/hero-section';
import EventsSection, { Event, MOCK_EVENTS } from '../components/landing-page/events-section';
import DegreesSection from '../components/landing-page/degrees-section';
import ResourcesSection from '../components/landing-page/resources-section';
import AboutSection from '../components/landing-page/about-section';
import ImpactSection from '../components/landing-page/impact-section';
import ApproachSection from '../components/landing-page/approach-section';
import MarqueeBanner from '../components/landing-page/marquee-banner';
import FloatingCta from '../components/landing-page/floating-cta';
import IntroSplash from '../components/landing-page/intro-splash';

const PAGE_TITLE = 'ITCA Hub | School of ICT Student Community';
const PAGE_DESCRIPTION =
  'ITCA is the student association for every School of ICT student at the University of The Gambia—organising bootcamps, sporting events, and campus initiatives.';
const OG_IMAGE = `${SITE_URL}/itca-logo.png`;

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
  const [showIntro, setShowIntro] = useState(true);
  const [pageReady, setPageReady] = useState(false);

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
        <link rel="icon" href="/itca-logo.png" />

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
      </Head>
      <div className="landing-itca">
        {showIntro && (
          <IntroSplash
            onReveal={() => setPageReady(true)}
            onComplete={() => setShowIntro(false)}
          />
        )}

        <div
          className={`transition-opacity duration-500 ${
            pageReady ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <Header homeHero />
          <main>
            <HeroSection />
            <div className="relative z-20">
              <AboutSection />
              <MarqueeBanner />
              <ImpactSection />
              <EventsSection initialEvents={initialEvents} />
              <ApproachSection />
              <DegreesSection />
              <VirtualTour />
              <ResourcesSection />
              <Footer />
            </div>
          </main>
          {pageReady && <FloatingCta />}
        </div>
      </div>
    </>
  );
};

export default HomePage;

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  const userData = isLoggedIn(req);

  if (userData && typeof userData !== 'boolean') {
    const { role } = userData as UserAuth;

    if (role === 'admin') {
      return {
        redirect: {
          destination: '/admin',
          permanent: false,
        },
      };
    }
  }

  let initialEvents: Event[] = [];

  try {
    const response = await axios.get(`${BASE_URL}/events/upcoming?page=1&limit=24`);

    if (response.data.status === 'success') {
      initialEvents = response.data.data;
    }
  } catch {
    // Events are optional for the homepage; client can retry if needed.
  }

  if (initialEvents.length === 0) {
    initialEvents = MOCK_EVENTS;
  }

  return {
    props: {
      userData: false,
      initialEvents,
    },
  };
};
