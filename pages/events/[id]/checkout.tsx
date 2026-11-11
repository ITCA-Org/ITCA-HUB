import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import { Loader } from 'lucide-react';
import { toast } from 'sonner';
import { BASE_URL } from '@/utils/url';
import { checkoutTicket } from '@/hooks/tickets/use-tickets';
import { EventProps } from '@/types/interfaces/event';
import { getErrorMessage } from '@/utils/error';
import { TicketEventSummary } from '@/components/tickets/ticket-event-summary';
import LandingLayout from '@/components/landing-page/landing-layout';
import PageHeading from '@/components/landing-page/page-heading';

const CheckoutPage = () => {
  const router = useRouter();
  const { id, tier } = router.query;
  const [event, setEvent] = useState<EventProps | null>(null);
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tierType = tier as 'standard' | 'premium';

  useEffect(() => {
    if (!id) return;

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
  }, [id]);

  const selectedTier = event?.ticketTiers?.find((t) => t.type === tierType && t.enabled);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event || !selectedTier) return;

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

  if (isLoading) {
    return (
      <LandingLayout
        path="/events"
        title="Checkout | ITCA Hub"
        description="Complete your ITCA event ticket purchase."
        showNewsletter={false}
      >
        <PageHeading title="Checkout" description="Complete your ticket purchase securely." />
        <section className="flex min-h-[45vh] items-center justify-center bg-[#f7fbfd] px-5 py-16">
          <Loader className="h-8 w-8 animate-spin text-[#005080]" />
        </section>
      </LandingLayout>
    );
  }

  if (!event || !selectedTier) {
    return (
      <LandingLayout
        path="/events"
        title="Checkout | ITCA Hub"
        description="Complete your ITCA event ticket purchase."
        showNewsletter={false}
      >
        <PageHeading title="Checkout" description="Complete your ticket purchase securely." />
        <section className="bg-[#f7fbfd] px-5 py-12 sm:px-10 sm:py-20 lg:px-16">
          <div className="mx-auto max-w-[560px] rounded-[2rem] border border-[#005080]/15 bg-white p-8 text-center shadow-[0_16px_40px_rgba(0,80,128,0.08)] sm:p-10">
            <p className="text-sm text-[#005080]/75">Event or ticket tier not found.</p>
            <Link
              href={`/events/${id}/tickets`}
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[#005080] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#003e63]"
            >
              Choose a ticket
            </Link>
          </div>
        </section>
      </LandingLayout>
    );
  }

  const backHref =
    (event.ticketTiers?.filter((t) => t.enabled).length ?? 0) > 1
      ? `/events/${event._id}/tickets`
      : '/';

  return (
    <LandingLayout
      path="/events"
      title="Checkout | ITCA Hub"
      description={`Complete your ticket purchase for ${event.title}.`}
      showNewsletter={false}
    >
      <PageHeading
        title="Checkout"
        description="Review your ticket details and complete your purchase."
      />
      <section className="bg-[#f7fbfd] px-5 py-12 sm:px-10 sm:py-20 lg:px-16">
        <div className="mx-auto grid max-w-[1080px] gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,0.75fr)] lg:items-start">
          <div className="rounded-[2rem] border border-[#005080]/15 bg-white p-5 shadow-[0_16px_40px_rgba(0,80,128,0.08)] sm:p-8">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#005080]/60">
                Your selection
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[#005080]">Event details</h2>
            </div>
            <TicketEventSummary event={event} tier={selectedTier} compact />
          </div>

          <div className="rounded-[2rem] bg-[#005080] p-5 text-white shadow-[0_16px_40px_rgba(0,80,128,0.18)] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/65">
              Almost there
            </p>
            <h2 className="mt-2 text-2xl font-semibold">Your details</h2>
            <p className="mt-2 text-sm leading-6 text-white/75">
              Add your contact details so we can send your ticket after payment.
            </p>

            <form onSubmit={handleCheckout} className="mt-7 space-y-5">
              <div>
                <label htmlFor="buyer-name" className="mb-2 block text-sm font-semibold">
                  Full Name <span className="text-[#fbbf24]">*</span>
                </label>
                <input
                  id="buyer-name"
                  required
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="min-h-12 w-full rounded-xl border border-white/25 bg-white px-4 py-3 text-base text-[#005080] outline-none placeholder:text-[#005080]/45 focus:border-white focus:ring-2 focus:ring-white/30"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="buyer-email" className="mb-2 block text-sm font-semibold">
                  Email <span className="font-normal text-white/65">(optional)</span>
                </label>
                <input
                  id="buyer-email"
                  type="email"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  className="min-h-12 w-full rounded-xl border border-white/25 bg-white px-4 py-3 text-base text-[#005080] outline-none placeholder:text-[#005080]/45 focus:border-white focus:ring-2 focus:ring-white/30"
                  placeholder="your@email.com"
                />
                <p className="mt-2 text-xs text-white/65">
                  We&apos;ll email your ticket after payment.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#005080] transition hover:bg-[#f3f8fa] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting && <Loader className="h-4 w-4 animate-spin" />}
                {isSubmitting
                  ? 'Redirecting to payment...'
                  : `Pay D${selectedTier.price} via Modem Pay`}
              </button>
              <Link
                href={backHref}
                className="block text-center text-sm font-semibold text-white/75 underline decoration-white/35 underline-offset-4 transition hover:text-white"
              >
                Back to ticket options
              </Link>
            </form>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
};

export default CheckoutPage;
