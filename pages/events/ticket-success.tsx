import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { Loader, XCircle, RefreshCw } from 'lucide-react';
import { getTicketOrder, getTicketDownloadUrl } from '@/hooks/tickets/use-tickets';
import { EventTicketCard } from '@/components/tickets/event-ticket-card';
import {
  TicketFlowShell,
  TICKET_BLUE,
} from '@/components/tickets/ticket-flow-shell';
import { EventProps } from '@/types/interfaces/event';
import { TicketProps, TicketOrderSummary } from '@/types/interfaces/ticket';

const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 20;

const TicketSuccessPage = () => {
  const router = useRouter();
  const { token } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [orderData, setOrderData] = useState<{
    order: TicketOrderSummary;
    event: EventProps;
    tickets: TicketProps[];
  } | null>(null);

  const loadOrder = useCallback(async (options?: { showSpinner?: boolean }) => {
    if (!token || typeof token !== 'string') return null;

    if (options?.showSpinner) {
      setIsRefreshing(true);
    }

    try {
      const data = await getTicketOrder(token);
      setOrderData(data);
      return data;
    } catch {
      return null;
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [token]);

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

      attempts += 1;
      if (attempts < MAX_POLL_ATTEMPTS) {
        setTimeout(poll, POLL_INTERVAL_MS);
      }
    };

    poll();

    return () => {
      cancelled = true;
    };
  }, [token, loadOrder, router.isReady]);

  if (isLoading) {
    return (
      <div
        className="flex h-dvh items-center justify-center"
        style={{ backgroundColor: TICKET_BLUE }}
      >
        <Loader className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  if (!orderData) {
    return (
      <div
        className="flex h-dvh flex-col items-center justify-center gap-4 px-4"
        style={{ backgroundColor: TICKET_BLUE }}
      >
        <XCircle className="h-12 w-12 text-white" />
        <p className="text-white/90">Order not found or payment pending.</p>
        <Link href="/" className="text-white underline">
          Back to home
        </Link>
      </div>
    );
  }

  const { order, event, tickets } = orderData;
  const isPaid = order.status === 'paid';

  return (
    <>
      <Head>
        <style>{`
          @media print {
            @page { margin: 10mm; size: auto; }
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              background: #ffffff !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            body * { visibility: hidden; }
            #printable-ticket, #printable-ticket * { visibility: visible; }
            #printable-ticket {
              position: absolute;
              left: 50%;
              top: 0;
              transform: translateX(-50%);
              width: 380px;
              max-width: 100%;
              margin: 0;
              padding: 20px;
              background: #ffffff !important;
              border: none !important;
              box-shadow: none !important;
              border-radius: 0 !important;
            }
          }
        `}</style>
      </Head>

      <TicketFlowShell title="Ticket" backHref="/">
        {!isPaid && (
          <div className="text-center text-white">
            <Loader className="mx-auto mb-2 h-10 w-10 animate-spin text-lime-300" />
            <p className="text-base font-semibold">Processing Payment...</p>
            <p className="mt-1 text-xs text-white/80">
              Your payment is being confirmed. This usually takes a few seconds.
            </p>
            <button
              type="button"
              onClick={() => loadOrder({ showSpinner: true })}
              disabled={isRefreshing}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white hover:bg-white/25 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
              />
              {isRefreshing ? 'Checking...' : 'Check again'}
            </button>
          </div>
        )}

        {isPaid &&
          tickets.map((ticket) => (
            <div key={ticket._id} className="flex min-h-0 flex-1 flex-col">
              <EventTicketCard
                ticket={ticket}
                event={event}
                downloadUrl={getTicketDownloadUrl(ticket._id, token as string)}
              />
            </div>
          ))}
      </TicketFlowShell>
    </>
  );
};

export default TicketSuccessPage;
