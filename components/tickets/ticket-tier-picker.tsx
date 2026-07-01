import Link from 'next/link';
import { ChevronRight, MapPin, Calendar, Clock, ArrowRight } from 'lucide-react';
import { EventProps, TicketTier } from '@/types/interfaces/event';
import {
  TicketFlowCard,
  formatTicketEventDate,
  formatTicketEventTime,
  TICKET_BLUE,
  TICKET_BUTTON_BLUE,
} from '@/components/tickets/ticket-flow-shell';

interface TicketTierPickerProps {
  event: EventProps;
  tiers: TicketTier[];
}

function TierBenefits({ tier }: { tier: TicketTier }) {
  if (tier.benefits) {
    return (
      <p className="mt-1 text-xs leading-relaxed text-gray-500 md:mt-2 md:text-sm md:leading-relaxed">
        {tier.benefits}
      </p>
    );
  }
  return (
    <p className="mt-1 text-xs text-gray-400 md:mt-2 md:text-sm">General admission</p>
  );
}

function MobileTierRow({ event, tier }: { event: EventProps; tier: TicketTier }) {
  return (
    <Link
      href={`/events/${event._id}/checkout?tier=${tier.type}`}
      className="group flex items-center gap-3 rounded-2xl border-2 border-gray-100 bg-gray-50/80 p-4 transition hover:border-[#4f86ef] hover:bg-[#eef4ff]"
    >
      <div className="min-w-0 flex-1">
        <p className="font-bold text-gray-900">{tier.label}</p>
        <TierBenefits tier={tier} />
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wide text-gray-400">Price</p>
          <p className="text-lg font-bold" style={{ color: TICKET_BLUE }}>
            D{tier.price}
          </p>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-300 transition group-hover:text-[#4f86ef]" />
      </div>
    </Link>
  );
}

function DesktopTierCard({ event, tier }: { event: EventProps; tier: TicketTier }) {
  return (
    <Link
      href={`/events/${event._id}/checkout?tier=${tier.type}`}
      className="group flex h-full flex-col rounded-2xl border-2 border-gray-100 bg-gray-50/60 p-6 transition hover:border-[#4f86ef] hover:bg-[#eef4ff] hover:shadow-md"
    >
      <div className="flex-1">
        <p className="text-xl font-bold text-gray-900">{tier.label}</p>
        <TierBenefits tier={tier} />
      </div>

      <div className="mt-6 flex items-end justify-between gap-4 border-t border-dashed border-gray-200 pt-5">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400">Price</p>
          <p className="text-3xl font-bold" style={{ color: TICKET_BLUE }}>
            D{tier.price}
          </p>
        </div>
        <span
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition group-hover:opacity-90"
          style={{ backgroundColor: TICKET_BUTTON_BLUE }}
        >
          Select
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

function EventImage({ event, className = '' }: { event: EventProps; className?: string }) {
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-sky-300 via-violet-300 to-orange-300 ${className}`}
    >
      {event.imageUrl ? (
        <img src={event.imageUrl} alt={event.title} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full items-center justify-center text-sm font-medium text-white">
          ITCA Hub Event
        </div>
      )}
    </div>
  );
}

export function TicketTierPicker({ event, tiers }: TicketTierPickerProps) {
  return (
    <>
      {/* Mobile: single stacked card */}
      <div className="md:hidden">
        <TicketFlowCard className="overflow-hidden !px-0 !py-0">
          <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-sky-300 via-violet-300 to-orange-300">
            {event.imageUrl ? (
              <img
                src={event.imageUrl}
                alt={event.title}
                className="h-full w-full object-cover"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="text-[11px] font-medium uppercase tracking-wider text-white/80">
                ITCA Hub Event
              </p>
              <h2 className="mt-1 text-xl font-bold leading-tight text-white line-clamp-2">
                {event.title}
              </h2>
            </div>
          </div>

          <div className="space-y-2 px-5 pt-4">
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <Calendar className="mt-0.5 h-4 w-4 shrink-0" style={{ color: TICKET_BLUE }} />
              <span className="font-medium">{formatTicketEventDate(event.date)}</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <Clock className="mt-0.5 h-4 w-4 shrink-0" style={{ color: TICKET_BLUE }} />
              <span className="font-medium">{formatTicketEventTime(event.time)}</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <MapPin className="mt-0.5 h-4 shrink-0" style={{ color: TICKET_BLUE }} />
              <span className="font-medium leading-snug">{event.location}</span>
            </div>
          </div>

          <div
            className="mx-5 my-5 border-t border-dashed"
            style={{ borderColor: `${TICKET_BLUE}55` }}
          />

          <div className="px-5 pb-5">
            <div className="mb-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Step 1 of 2
              </p>
              <h3 className="mt-1 text-lg font-bold text-gray-900">Choose your ticket</h3>
              <p className="mt-1 text-sm text-gray-500">
                Select a tier to continue to checkout
              </p>
            </div>

            <div className="space-y-3">
              {tiers.map((tier) => (
                <MobileTierRow key={tier.type} event={event} tier={tier} />
              ))}
            </div>
          </div>
        </TicketFlowCard>
      </div>

      {/* Desktop: two-column layout */}
      <div className="hidden md:grid md:grid-cols-5 md:gap-6 md:items-start">
        <TicketFlowCard className="col-span-2 overflow-hidden !px-0 !py-0 !max-w-none">
          <EventImage event={event} className="h-56 w-full" />
          <div className="p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
              ITCA Hub Event
            </p>
            <h2 className="mt-2 text-2xl font-bold leading-tight text-gray-900">
              {event.title}
            </h2>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-gray-50 px-4 py-3">
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <p className="text-[11px] font-medium uppercase tracking-wide">Date</p>
                </div>
                <p className="mt-1 text-sm font-bold text-gray-900">
                  {formatTicketEventDate(event.date)}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 px-4 py-3">
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="h-4 w-4" />
                  <p className="text-[11px] font-medium uppercase tracking-wide">Time</p>
                </div>
                <p className="mt-1 text-sm font-bold text-gray-900">
                  {formatTicketEventTime(event.time)}
                </p>
              </div>
              <div className="col-span-2 rounded-xl bg-gray-50 px-4 py-3">
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin className="h-4 w-4" />
                  <p className="text-[11px] font-medium uppercase tracking-wide">Location</p>
                </div>
                <p className="mt-1 text-sm font-bold text-gray-900">{event.location}</p>
              </div>
            </div>
          </div>
        </TicketFlowCard>

        <TicketFlowCard className="col-span-3 !max-w-none p-6 lg:p-8">
          <div className="mb-6">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Step 1 of 2
            </p>
            <h3 className="mt-1 text-2xl font-bold text-gray-900">Choose your ticket</h3>
            <p className="mt-2 text-sm text-gray-500">
              Pick the tier that works for you, then continue to checkout and payment.
            </p>
          </div>

          <div
            className={`grid gap-4 ${
              tiers.length > 1 ? 'sm:grid-cols-2' : 'grid-cols-1'
            }`}
          >
            {tiers.map((tier) => (
              <DesktopTierCard key={tier.type} event={event} tier={tier} />
            ))}
          </div>
        </TicketFlowCard>
      </div>
    </>
  );
}
