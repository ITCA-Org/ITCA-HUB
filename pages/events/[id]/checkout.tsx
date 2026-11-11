import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { ArrowLeft, CalendarDays, Clock3, LoaderCircle, MapPin, Ticket } from 'lucide-react';
import { toast } from 'sonner';
import { BASE_URL } from '@/utils/url';
import { checkoutTicket } from '@/hooks/tickets/use-tickets';
import { EventProps } from '@/types/interfaces/event';
import { getErrorMessage } from '@/utils/error';
import {
  formatTicketEventDate,
  formatTicketEventTime,
} from '@/components/tickets/ticket-flow-shell';
import LandingLayout from '@/components/landing-page/landing-layout';

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

  const selectedTier = event?.ticketTiers?.find((item) => item.type === tierType && item.enabled);

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

  const enabledTierCount = event?.ticketTiers?.filter((item) => item.enabled).length ?? 0;
  const backHref = event && enabledTierCount > 1 ? `/events/${event._id}/tickets` : '/events';

  return (
    <LandingLayout
      path="/events"
      title="Event checkout | ITCA Hub"
      description={
        event
          ? `Complete your ticket purchase for ${event.title}.`
          : 'Complete your ITCA event ticket purchase.'
      }
      showNewsletter={false}
    >
      <section className="min-h-[70vh] bg-[#F2F7FA] px-5 pb-10 pt-24 text-[#12364B] sm:px-10 sm:pb-16 sm:pt-32 lg:px-16">
        <div className="mx-auto max-w-[1120px]">
          <Link
            href={backHref}
            className="inline-flex min-h-10 items-center gap-2 rounded-full text-sm font-semibold text-[#005080] transition hover:text-[#003B5E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#005080]"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            {backHref === '/events' ? 'Back to events' : 'Back to ticket options'}
          </Link>

          <div className="mb-6 mt-4 sm:mb-8 sm:mt-5">
            <h1 className="max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.035em] text-[#005080] sm:text-4xl">
              Complete your booking
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#12364B]/70 sm:text-base">
              Check the event details, then enter your name to continue to payment.
            </p>
          </div>

          {isLoading ? (
            <div
              role="status"
              aria-label="Loading event details"
              className="flex min-h-[360px] items-center justify-center rounded-2xl bg-white"
            >
              <LoaderCircle className="h-8 w-8 animate-spin text-[#005080]" />
            </div>
          ) : !event || !selectedTier ? (
            <div className="rounded-2xl bg-white px-6 py-12 text-center sm:px-10">
              <Ticket aria-hidden="true" className="mx-auto h-8 w-8 text-[#005080]/55" />
              <h2 className="mt-4 text-xl font-semibold text-[#005080]">
                This ticket is unavailable
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#12364B]/70">
                The event or ticket option may have changed. Return to events and choose an
                available ticket.
              </p>
              <Link
                href="/events"
                className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[#005080] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#003B5E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005080]"
              >
                Browse events
              </Link>
            </div>
          ) : (
            <div className="grid overflow-hidden rounded-2xl border border-[#005080]/12 bg-white shadow-[0_24px_70px_rgba(10,48,69,0.08)] lg:grid-cols-[1.04fr_0.96fr]">
              <div className="min-w-0">
                <div className="relative h-52 overflow-hidden bg-[#D4E6F2] sm:h-72 lg:h-[340px]">
                  {event.imageUrl ? (
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      fill
                      unoptimized
                      priority
                      sizes="(max-width: 1023px) 100vw, 560px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#005080]/60">
                      <Ticket aria-hidden="true" className="h-12 w-12" />
                    </div>
                  )}
                </div>

                <div className="px-5 py-5 sm:px-8 sm:py-7">
                  <p className="text-sm font-semibold text-[#005080]">Event</p>
                  <h2 className="mt-2 max-w-xl text-2xl font-semibold leading-tight tracking-[-0.025em] text-[#12364B] sm:text-3xl">
                    {event.title}
                  </h2>
                  <div className="mt-6 grid gap-4 border-t border-[#005080]/12 pt-5 sm:grid-cols-2">
                    <EventDetail
                      icon={<CalendarDays aria-hidden="true" className="h-[18px] w-[18px]" />}
                      label="Date"
                      value={formatTicketEventDate(event.date)}
                    />
                    <EventDetail
                      icon={<Clock3 aria-hidden="true" className="h-[18px] w-[18px]" />}
                      label="Time"
                      value={formatTicketEventTime(event.time)}
                    />
                    <EventDetail
                      icon={<MapPin aria-hidden="true" className="h-[18px] w-[18px]" />}
                      label="Location"
                      value={event.location}
                      className="sm:col-span-2"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-dashed border-[#005080]/25 bg-[#F8FBFC] px-5 py-6 sm:px-8 sm:py-8 lg:border-l lg:border-t-0 lg:px-9 lg:py-10">
                <div className="flex items-end justify-between gap-4 border-b border-[#005080]/15 pb-5">
                  <div>
                    <p className="text-sm text-[#12364B]/65">Selected ticket</p>
                    <h2 className="mt-1 text-xl font-semibold text-[#005080]">
                      {selectedTier.label}
                    </h2>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#12364B]/65">Total</p>
                    <p className="mt-0.5 text-3xl font-semibold tracking-[-0.04em] text-[#005080]">
                      D{selectedTier.price}
                    </p>
                  </div>
                </div>

                {selectedTier.benefits && (
                  <p className="border-b border-[#005080]/15 py-4 text-sm leading-6 text-[#12364B]/75">
                    {selectedTier.benefits}
                  </p>
                )}

                <form onSubmit={handleCheckout} className="mt-6 space-y-5">
                  <div>
                    <label
                      htmlFor="buyer-name"
                      className="mb-2 block text-sm font-semibold text-[#12364B]"
                    >
                      Full name <span className="text-[#B54738]">*</span>
                    </label>
                    <input
                      id="buyer-name"
                      autoComplete="name"
                      required
                      type="text"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="min-h-12 w-full rounded-lg border border-[#005080]/25 bg-white px-4 py-3 text-base text-[#12364B] outline-none transition placeholder:text-[#12364B]/40 focus:border-[#005080] focus:ring-2 focus:ring-[#005080]/15"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="buyer-email"
                      className="mb-2 block text-sm font-semibold text-[#12364B]"
                    >
                      Email <span className="font-normal text-[#12364B]/55">(optional)</span>
                    </label>
                    <input
                      id="buyer-email"
                      autoComplete="email"
                      type="email"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      className="min-h-12 w-full rounded-lg border border-[#005080]/25 bg-white px-4 py-3 text-base text-[#12364B] outline-none transition placeholder:text-[#12364B]/40 focus:border-[#005080] focus:ring-2 focus:ring-[#005080]/15"
                      placeholder="you@example.com"
                    />
                    <p className="mt-2 text-xs leading-5 text-[#12364B]/60">
                      We&apos;ll email your ticket after payment.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#005080] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#003B5E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005080] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting && (
                      <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
                    )}
                    {isSubmitting ? 'Redirecting to payment…' : `Pay D${selectedTier.price}`}
                  </button>
                  <p className="text-center text-xs leading-5 text-[#12364B]/55">
                    You&apos;ll continue to Modem Pay to complete your payment securely.
                  </p>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>
    </LandingLayout>
  );
};

function EventDetail({
  icon,
  label,
  value,
  className = '',
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`flex min-w-0 items-start gap-3 ${className}`}>
      <span className="mt-0.5 shrink-0 text-[#005080]/65">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-[#12364B]/55">{label}</p>
        <p className="mt-0.5 break-words text-sm font-semibold leading-5 text-[#12364B]">{value}</p>
      </div>
    </div>
  );
}

export default CheckoutPage;
