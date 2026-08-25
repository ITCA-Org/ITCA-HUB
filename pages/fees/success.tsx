import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import QRCode from 'qrcode';
import { CheckCircle, Loader, RefreshCw } from 'lucide-react';
import LandingLayout from '@/components/landing-page/landing-layout';
import { darkCtaClass } from '@/components/landing-page/brand';
import { DuesOrderResponse, getDuesOrder } from '@/hooks/dues/use-dues';
import { FEE_TOTAL_REQUIRED, formatFeeAmount } from '@/utils/fees';

const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 20;

const FeesSuccessPage = () => {
  const router = useRouter();
  const { token } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [orderData, setOrderData] = useState<DuesOrderResponse | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState('');

  const redirectIfFailed = useCallback(
    (data: DuesOrderResponse | null) => {
      if (!token || typeof token !== 'string' || !data) return false;
      const status = data.order.status;
      if (status === 'failed' || status === 'cancelled') {
        void router.replace(`/fees/failed?token=${encodeURIComponent(token)}`);
        return true;
      }
      return false;
    },
    [token, router]
  );

  const loadOrder = useCallback(
    async (options?: { showSpinner?: boolean }) => {
      if (!token || typeof token !== 'string') return null;

      if (options?.showSpinner) {
        setIsRefreshing(true);
      }

      try {
        const data = await getDuesOrder(token);
        if (redirectIfFailed(data)) return data;
        setOrderData(data);
        return data;
      } catch {
        return null;
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [token, redirectIfFailed]
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
      const data = await loadOrder();
      if (cancelled) return;

      if (!data && attempts === 0) {
        setOrderData(null);
        return;
      }

      if (data?.order.status === 'paid') {
        return;
      }

      if (
        data?.order.status === 'failed' ||
        data?.order.status === 'cancelled'
      ) {
        return;
      }

      attempts += 1;
      if (attempts < MAX_POLL_ATTEMPTS) {
        setTimeout(poll, POLL_INTERVAL_MS);
      } else if (data?.order.status === 'pending') {
        // Timed out waiting for confirmation — treat as failed/incomplete
        void router.replace(`/fees/failed?token=${encodeURIComponent(token)}`);
      }
    };

    void poll();

    return () => {
      cancelled = true;
    };
  }, [router.isReady, token, loadOrder, router]);

  useEffect(() => {
    const payload = orderData?.order.qrPayload;
    if (!payload || orderData.order.status !== 'paid') {
      setQrDataUrl('');
      return;
    }

    let cancelled = false;
    QRCode.toDataURL(payload, { width: 280, margin: 2 })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl('');
      });

    return () => {
      cancelled = true;
    };
  }, [orderData]);

  const paid = orderData?.order.status === 'paid';

  return (
    <LandingLayout
      title="Payment successful | ITCA Hub"
      description="Your semester dues payment confirmation"
      path="/fees/success"
      showNewsletter={false}
      showFloatingCta={false}
    >
      <Head>
        <meta name="robots" content="noindex" />
      </Head>

      <section className="bg-white px-4 py-20 sm:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-xl">
          <p className="landing-mono mb-5 text-base text-[#FF6A00]">Semester dues</p>

          {isLoading && (
            <div className="flex items-center gap-3 text-[#0A1628]/70">
              <Loader className="h-5 w-5 animate-spin" />
              Confirming your payment…
            </div>
          )}

          {!isLoading && !orderData && (
            <>
              <h1 className="text-4xl font-bold text-[#0A1628]">Payment not found</h1>
              <p className="mt-4 text-lg text-[#0A1628]/70">
                This link is invalid or expired. Start again from the fees page.
              </p>
              <Link href="/fees" className={`${darkCtaClass} mt-8 inline-flex`}>
                Back to fees
              </Link>
            </>
          )}

          {!isLoading && orderData && !paid && (
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
                onClick={() => void loadOrder({ showSpinner: true })}
                className={`${darkCtaClass} mt-8 inline-flex disabled:opacity-60`}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh status
              </button>
            </>
          )}

          {!isLoading && orderData && paid && (
            <>
              <div className="mb-4 flex items-center gap-3 text-green-700">
                <CheckCircle className="h-8 w-8" />
                <h1 className="text-3xl font-bold text-[#0A1628]">Payment successful</h1>
              </div>

              <div className="mt-8 rounded-[1.75rem] bg-[#D4E6F2] p-8">
                <p className="text-sm text-[#0A1628]/60">Receipt</p>
                <p className="mt-1 text-lg font-semibold text-[#0A1628]">
                  {orderData.order.receiptNumber}
                </p>
                <dl className="mt-6 space-y-2 text-base text-[#0A1628]/80">
                  <div className="flex justify-between gap-4">
                    <dt>Name</dt>
                    <dd className="font-medium text-[#0A1628]">{orderData.order.fullName}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Matric</dt>
                    <dd className="font-medium text-[#0A1628]">
                      {orderData.order.matricNumber}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Paid</dt>
                    <dd className="font-medium text-[#0A1628]">
                      {formatFeeAmount(orderData.order.amount)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Total for matric</dt>
                    <dd className="font-medium text-[#0A1628]">
                      {formatFeeAmount(orderData.totalPaid)} /{' '}
                      {formatFeeAmount(orderData.feeTotalRequired || FEE_TOTAL_REQUIRED)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Eligibility</dt>
                    <dd
                      className={`font-semibold ${
                        orderData.auditEligible ? 'text-green-700' : 'text-amber-700'
                      }`}
                    >
                      {orderData.auditEligible ? 'Audit eligible' : 'Not yet eligible'}
                    </dd>
                  </div>
                </dl>

                {qrDataUrl && (
                  <div className="mt-8 flex flex-col items-center">
                    <p className="mb-3 text-center text-sm font-medium text-[#0A1628]">
                      Show this QR to the faculty officer
                    </p>
                    <Image
                      src={qrDataUrl}
                      alt="Dues receipt QR code"
                      width={220}
                      height={220}
                      unoptimized
                      className="rounded-xl bg-white p-2"
                    />
                    <p className="mt-3 text-center text-xs text-[#0A1628]/55">
                      The same QR was emailed to {orderData.order.email}
                    </p>
                  </div>
                )}
              </div>

              <Link href="/fees" className={`${darkCtaClass} mt-8 inline-flex`}>
                Back to fees
              </Link>
            </>
          )}
        </div>
      </section>
    </LandingLayout>
  );
};

export default FeesSuccessPage;
