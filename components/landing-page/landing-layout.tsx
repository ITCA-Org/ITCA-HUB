import Head from 'next/head';
import { ReactNode } from 'react';
import Header from './header';
import Footer from './footer';
import FloatingCta from './floating-cta';
import { SITE_URL } from '@/utils/site';

type LandingLayoutProps = {
  children: ReactNode;
  title: string;
  description: string;
  path?: string;
  /** Transparent-over-hero nav only on the homepage */
  homeHero?: boolean;
  showFloatingCta?: boolean;
};

const LandingLayout = ({
  children,
  title,
  description,
  path = '/',
  homeHero = false,
  showFloatingCta = true,
}: LandingLayoutProps) => {
  const canonical = `${SITE_URL}${path === '/' ? '/' : path}`;
  const ogImage = `${SITE_URL}/itca-logo.png`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={canonical} />
        <link rel="icon" href="/itca-logo.png" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={ogImage} />
        <meta property="og:site_name" content="ITCA Hub" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
      </Head>

      <div className="landing-itca">
        <Header homeHero={homeHero} />
        <main>{children}</main>
        <Footer />
        {showFloatingCta && <FloatingCta />}
      </div>
    </>
  );
};

export default LandingLayout;
