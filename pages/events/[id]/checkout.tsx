import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import Head from 'next/head';
import { Loader } from 'lucide-react';
import { toast } from 'sonner';
import { BASE_URL } from '@/utils/url';
import { checkoutTicket } from '@/hooks/tickets/use-tickets';
import { EventProps } from '@/types/interfaces/event';
import { getErrorMessage } from '@/utils/error';
import {
  TicketFlowShell,
  TicketFlowCard,
  TicketFlowButton,
  TicketFlowField,
  ticketFlowInputClassName,
  TICKET_BLUE,
} from '@/components/tickets/ticket-flow-shell';
import { TicketEventSummary } from '@/components/tickets/ticket-event-summary';

const CheckoutPage = () => {
  const router = useRouter();
  const { id, tier } = router.query;
  const [event, setEvent] = useState<EventProps | null>(null);
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tierType = (Array.isArray(tier) ? tier[0] : tier) as
    | 'standard'
    | 'premium'
    | undefined;

  useEffect(() => {
    if (!router.isReady || !id || typeof id !== 'string') return;

    const fetchEvent = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/events/${id}/public`);
        setEvent(data.data);
      } catch {
        toast.error('Failed to load event');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id, router.isReady]);

  const selectedTier =
    tierType && event?.ticketTiers?.find((t) => t.type === tierType && t.enabled);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event || !selectedTier || !tierType) return;

    setIsSubmitting(true);
    try {
      const result = await checkoutTicket({
        eventId: event._id,
        tierType,
        buyerName: buyerName.trim(),
        buyerEmail: buyerEmail.trim() || undefined,
      });
      window.location.href = result.paymentLink;
    } catch (error) {
      toast.error('Checkout failed', {
        description: getErrorMessage(error as Error).message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !router.isReady) {
    return (
      <div
        className="flex h-dvh items-center justify-center"
        style={{ backgroundColor: TICKET_BLUE }}
      >
        <Loader className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  if (!event || !selectedTier) {
    return (
      <TicketFlowShell title="Checkout" backHref="/">
        <TicketFlowCard>
          <p className="text-center text-sm text-gray-600">
            Event or ticket tier not found.
          </p>
          <Link
            href={`/events/${id}/tickets`}
            className="mt-4 block text-center text-sm font-medium"
            style={{ color: TICKET_BLUE }}
          >
            Choose a ticket
          </Link>
        </TicketFlowCard>
      </TicketFlowShell>
    );
  }

  const backHref =
    (event.ticketTiers?.filter((t) => t.enabled).length ?? 0) > 1
      ? `/events/${event._id}/tickets`
      : '/';

  return (
    <TicketFlowShell title="Checkout" backHref={backHref}>
      <Head>
        <title>Checkout | ITCA Hub</title>
      </Head>
      <TicketFlowCard>
        <TicketEventSummary event={event} tier={selectedTier} compact />

        <form onSubmit={handleCheckout} className="mt-5 space-y-4">
          <TicketFlowField label="Full Name" required>
            <input
              required
              type="text"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              className={ticketFlowInputClassName}
              placeholder="Your full name"
            />
          </TicketFlowField>

          <TicketFlowField
            label="Email"
            hint="Optional — we'll email your ticket after payment"
          >
            <input
              type="email"
              value={buyerEmail}
              onChange={(e) => setBuyerEmail(e.target.value)}
              className={ticketFlowInputClassName}
              placeholder="your@email.com"
            />
          </TicketFlowField>

          <TicketFlowButton
            type="submit"
            loading={isSubmitting}
            loadingText="Redirecting to payment..."
          >
            Pay D{selectedTier.price} via Modem Pay
          </TicketFlowButton>
        </form>
      </TicketFlowCard>
    </TicketFlowShell>
  );
};

export default CheckoutPage;
