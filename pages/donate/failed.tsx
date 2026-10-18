import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { Loader, XCircle } from 'lucide-react';
import LandingLayout from '@/components/landing-page/landing-layout';
import { darkCtaClass } from '@/components/landing-page/brand';
import { formatDalasi } from '@/components/landing-page/shop-data';
import { DonationSummary, getDonation } from '@/hooks/donations/use-donations';

const DonateFailedPage = () => {
  const router = useRouter();
  const { token } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [donation, setDonation] = useState<DonationSummary | null>(null);

  const loadDonation = useCallback(async () => {
    if (!token || typeof token !== 'string') {
      setIsLoading(false);
      return;
    }

    try {
      const data = await getDonation(token);
      setDonation(data.donation);
      if (data.donation.status === 'paid') {
        void router.replace(`/donate/success?token=${encodeURIComponent(token)}`);
      }
    } catch {
      setDonation(null);
    } finally {
      setIsLoading(false);
    }
  }, [token, router]);

  useEffect(() => {
    if (!router.isReady) return;
    void loadDonation();
  }, [router.isReady, loadDonation]);

  return (
    <LandingLayout
      title="Donation failed | ITCA Hub"
      description="Your ITCA donation could not be completed"
      path="/donate/failed"
      showNewsletter={false}
      showFloatingCta={false}
    >
      <Head>
        <meta name="robots" content="noindex" />
      </Head>

      <section className="bg-white px-4 py-20 sm:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-xl">
          <p className="landing-mono mb-5 text-base text-[#FF6A00]">ITCA Donations</p>

          {isLoading ? (
            <div className="flex items-center gap-3 text-[#0A1628]/70">
              <Loader className="h-5 w-5 animate-spin" />
              Checking payment status…
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center gap-3 text-red-600">
                <XCircle className="h-8 w-8 shrink-0" />
                <h1 className="text-3xl font-bold text-[#0A1628] sm:text-4xl">
                  Donation not completed
                </h1>
              </div>

              <p className="mt-4 text-lg text-[#0A1628]/70">
                The payment was cancelled or could not be completed. You have not been charged for
                this attempt.
              </p>

              {donation && (
                <div className="mt-8 rounded-[1.75rem] bg-[#FFE0CC] p-7">
                  <dl className="space-y-2 text-base text-[#0A1628]/80">
                    <div className="flex justify-between gap-4">
                      <dt>Campaign</dt>
                      <dd className="text-right font-medium text-[#0A1628]">
                        {donation.campaignTitle}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Amount</dt>
                      <dd className="font-medium text-[#0A1628]">
                        {formatDalasi(donation.amount)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Status</dt>
                      <dd className="font-medium capitalize text-[#0A1628]">{donation.status}</dd>
                    </div>
                  </dl>
                </div>
              )}

              <Link href="/donate" className={`${darkCtaClass} mt-8 inline-flex`}>
                Try again
              </Link>
            </>
          )}
        </div>
      </section>
    </LandingLayout>
  );
};

export default DonateFailedPage;
