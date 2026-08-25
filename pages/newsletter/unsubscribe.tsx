import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { darkCtaClass } from '@/components/landing-page/brand';
import LandingLayout from '@/components/landing-page/landing-layout';
import { BASE_URL } from '@/utils/url';
import { getErrorMessage } from '@/utils/error';

type UnsubscribeState = 'loading' | 'success' | 'already' | 'invalid' | 'missing';

const NewsletterUnsubscribePage = () => {
  const router = useRouter();
  const [state, setState] = useState<UnsubscribeState>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!router.isReady) return;

    const tokenParam = router.query.token;
    const token = typeof tokenParam === 'string' ? tokenParam.trim() : '';

    if (!token) {
      setState('missing');
      return;
    }

    let cancelled = false;

    const unsubscribe = async () => {
      try {
        const { data } = await axios.post(
          `${BASE_URL}/newsletter-subscribers/unsubscribe`,
          { token }
        );

        if (cancelled) return;

        setState(data?.data?.alreadyUnsubscribed ? 'already' : 'success');
      } catch (error) {
        if (cancelled) return;
        const { message, statusCode } = getErrorMessage(error as Error);
        if (statusCode === 404) {
          setState('invalid');
        } else {
          setState('invalid');
          setErrorMessage(message);
        }
      }
    };

    void unsubscribe();

    return () => {
      cancelled = true;
    };
  }, [router.isReady, router.query.token]);

  const title =
    state === 'success' || state === 'already'
      ? "You've been unsubscribed"
      : state === 'loading'
        ? 'Unsubscribing…'
        : 'Unsubscribe failed';

  const description =
    state === 'success'
      ? "You won't receive further ITCA newsletter emails."
      : state === 'already'
        ? 'This email was already removed from the newsletter list.'
        : state === 'missing'
          ? 'This unsubscribe link is missing a token.'
          : state === 'loading'
            ? 'Please wait while we process your request.'
            : errorMessage || 'This unsubscribe link is invalid or has expired.';

  return (
    <LandingLayout
      title={`${title} | ITCA Hub`}
      description={description}
      path="/newsletter/unsubscribe"
      showNewsletter={false}
      showFloatingCta={false}
    >
      <Head>
        <meta name="robots" content="noindex" />
      </Head>

      <section className="bg-white px-4 py-24 sm:px-10 lg:px-16 lg:py-32">
        <div className="mx-auto max-w-xl">
          <p className="landing-mono mb-5 text-base text-[#FF6A00]">Newsletter</p>
          <h1 className="text-4xl font-bold leading-tight text-[#0A1628] sm:text-5xl">
            {title}
          </h1>
          <p className="mt-6 text-lg text-[#0A1628]/70">{description}</p>

          {(state === 'success' || state === 'already') && (
            <div className="mt-10 rounded-[1.75rem] bg-[#D4E6F2] p-8">
              <p className="text-base text-[#0A1628]/75">
                Changed your mind? You can subscribe again anytime from the homepage.
              </p>
              <Link href="/" className={`${darkCtaClass} mt-6 inline-flex`}>
                Back to home
              </Link>
            </div>
          )}

          {(state === 'invalid' || state === 'missing') && (
            <Link href="/" className={`${darkCtaClass} mt-10 inline-flex`}>
              Back to home
            </Link>
          )}
        </div>
      </section>
    </LandingLayout>
  );
};

export default NewsletterUnsubscribePage;
