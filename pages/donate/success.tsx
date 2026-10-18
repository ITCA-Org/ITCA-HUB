import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { CheckCircle, Loader, RefreshCw } from 'lucide-react';
import LandingLayout from '@/components/landing-page/landing-layout';
import { darkCtaClass } from '@/components/landing-page/brand';
import { formatDalasi } from '@/components/landing-page/shop-data';
import { DonationSummary, getDonation } from '@/hooks/donations/use-donations';

const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 20;

const DonateSuccessPage = () => {
  const router = useRouter();
  const { token } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [donation, setDonation] = useState<DonationSummary | null>(null);

  const loadDonation = useCallback(
    async (options?: { showSpinner?: boolean }) => {
      if (!token || typeof token !== 'string') return null;
      if (options?.showSpinner) setIsRefreshing(true);

      try {
        const data = await getDonation(token);
        const status = data.donation.status;
        if (status === 'failed' || status === 'cancelled') {
          void router.replace(`/donate/failed?token=${encodeURIComponent(token)}`);
          return data.donation;
        }
        setDonation(data.donation);
        return data.donation;
      } catch {
        return null;
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [token, router]
  );

  useEffect(() => {
    if (!router.isReady) return;
    if (!token || typeof token !== 'string') {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    let attempts = 0;

    const poll = async () => {
      const data = await loadDonation();
      if (cancelled || !data) return;
      if (data.status !== 'pending') return;

      attempts += 1;
      if (attempts < MAX_POLL_ATTEMPTS) {
        setTimeout(poll, POLL_INTERVAL_MS);
      } else {
        void router.replace(`/donate/failed?token=${encodeURIComponent(token)}`);
      }
    };

    void poll();
    return () => {
      cancelled = true;
    };
  }, [router.isReady, token, loadDonation, router]);

  const paid = donation?.status === 'paid';

  return (
    <LandingLayout
      title="Thank you | ITCA Hub"
      description="Your ITCA donation confirmation"
      path="/donate/success"
      showNewsletter={false}
      showFloatingCta={false}
    >
      <Head>
        <meta name="robots" content="noindex" />
      </Head>

      <section className="bg-white px-4 py-20 sm:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-xl">
          <p className="landing-mono mb-5 text-base text-[#FF6A00]">ITCA Donations</p>

          {isLoading && (
            <div className="flex items-center gap-3 text-[#0A1628]/70">
              <Loader className="h-5 w-5 animate-spin" />
              Confirming your donation…
            </div>
          )}

          {!isLoading && !donation && (
            <>
              <h1 className="text-4xl font-bold text-[#0A1628]">Donation not found</h1>
              <p className="mt-4 text-lg text-[#0A1628]/70">This link is invalid or expired.</p>
              <Link href="/donate" className={`${darkCtaClass} mt-8 inline-flex`}>
                See campaigns
              </Link>
            </>
          )}

          {!isLoading && donation && !paid && (
            <>
              <div className="mb-4 flex items-center gap-3 text-[#0A1628]">
                <Loader className="h-6 w-6 animate-spin text-[#005080]" />
                <h1 className="text-3xl font-bold">Confirming payment…</h1>
              </div>
              <p className="text-lg text-[#0A1628]/70">
                If you just paid, hang tight — we&apos;re confirming with Modem Pay.
              </p>
              <button
                type="button"
                disabled={isRefreshing}
                onClick={() => void loadDonation({ showSpinner: true })}
                className={`${darkCtaClass} mt-8 inline-flex disabled:opacity-60`}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh status
              </button>
            </>
          )}

          {!isLoading && donation && paid && (
            <>
              <div className="mb-4 flex items-center gap-3 text-green-700">
                <CheckCircle className="h-8 w-8" />
                <h1 className="text-3xl font-bold text-[#0A1628]">
                  {donation.isAnonymous
                    ? 'Thank you!'
                    : `Thank you, ${donation.donorName.split(' ')[0]}!`}
                </h1>
              </div>
              <p className="text-lg text-[#0A1628]/70">
                Your donation to <strong>{donation.campaignTitle}</strong> was received.
              </p>

              <div className="mt-8 rounded-[1.75rem] bg-[#D4E6F2] p-8">
                <p className="text-sm text-[#0A1628]/60">Receipt</p>
                <p className="mt-1 text-lg font-semibold text-[#0A1628]">
                  {donation.receiptNumber}
                </p>
                <dl className="mt-6 space-y-2 text-base text-[#0A1628]/80">
                  <div className="flex justify-between gap-4">
                    <dt>Campaign</dt>
                    <dd className="text-right font-medium text-[#0A1628]">
                      {donation.campaignTitle}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Amount</dt>
                    <dd className="font-medium text-[#0A1628]">{formatDalasi(donation.amount)}</dd>
                  </div>
                  {donation.paidAt && (
                    <div className="flex justify-between gap-4">
                      <dt>Date</dt>
                      <dd className="font-medium text-[#0A1628]">
                        {new Date(donation.paidAt).toLocaleDateString()}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              <Link href="/donate" className={`${darkCtaClass} mt-8 inline-flex`}>
                See other campaigns
              </Link>
            </>
          )}
        </div>
      </section>
    </LandingLayout>
  );
};

export default DonateSuccessPage;
