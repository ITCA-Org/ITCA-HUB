import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { Loader, XCircle } from 'lucide-react';
import LandingLayout from '@/components/landing-page/landing-layout';
import { darkCtaClass } from '@/components/landing-page/brand';
import { DuesOrderResponse, getDuesOrder } from '@/hooks/dues/use-dues';
import { formatFeeAmount } from '@/utils/fees';

const FeesFailedPage = () => {
  const router = useRouter();
  const { token } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [orderData, setOrderData] = useState<DuesOrderResponse | null>(null);

  const loadOrder = useCallback(async () => {
    if (!token || typeof token !== 'string') {
      setIsLoading(false);
      return;
    }

    try {
      const data = await getDuesOrder(token);
      setOrderData(data);

      if (data.order.status === 'paid') {
        void router.replace(`/fees/success?token=${encodeURIComponent(token)}`);
      }
    } catch {
      setOrderData(null);
    } finally {
      setIsLoading(false);
    }
  }, [token, router]);

  useEffect(() => {
    if (!router.isReady) return;
    void loadOrder();
  }, [router.isReady, loadOrder]);

  return (
    <LandingLayout
      title="Payment failed | ITCA Hub"
      description="Your semester dues payment could not be completed"
      path="/fees/failed"
      showNewsletter={false}
      showFloatingCta={false}
    >
      <Head>
        <meta name="robots" content="noindex" />
      </Head>

      <section className="bg-white px-4 py-20 sm:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-xl">
          <p className="landing-mono mb-5 text-base text-[#FF6A00]">Semester dues</p>

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
                  Payment failed
                </h1>
              </div>

              <p className="mt-4 text-lg text-[#0A1628]/70">
                Your semester dues payment was cancelled or could not be completed. No charge was
                applied for this attempt.
              </p>

              {orderData && (
                <div className="mt-8 rounded-[1.75rem] bg-[#FFE0CC] p-7">
                  <dl className="space-y-2 text-base text-[#0A1628]/80">
                    <div className="flex justify-between gap-4">
                      <dt>Name</dt>
                      <dd className="font-medium text-[#0A1628]">
                        {orderData.order.fullName}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Matric</dt>
                      <dd className="font-medium text-[#0A1628]">
                        {orderData.order.matricNumber}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Amount</dt>
                      <dd className="font-medium text-[#0A1628]">
                        {formatFeeAmount(orderData.order.amount)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Status</dt>
                      <dd className="font-semibold capitalize text-red-700">
                        {orderData.order.status === 'pending'
                          ? 'Cancelled / incomplete'
                          : orderData.order.status}
                      </dd>
                    </div>
                  </dl>
                </div>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/fees" className={`${darkCtaClass} inline-flex`}>
                  Try again
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-full border border-[#0A1628]/15 px-5 py-3 text-sm font-semibold text-[#0A1628] transition hover:bg-[#0A1628]/5"
                >
                  Back to home
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </LandingLayout>
  );
};

export default FeesFailedPage;
