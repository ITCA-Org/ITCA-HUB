import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import { Loader } from 'lucide-react';
import { toast } from 'sonner';
import { BASE_URL } from '@/utils/url';
import { EventProps } from '@/types/interfaces/event';
import {
  TicketFlowShell,
  TicketFlowCard,
  TICKET_BLUE,
} from '@/components/tickets/ticket-flow-shell';
import { TicketTierPicker } from '@/components/tickets/ticket-tier-picker';

const TicketTiersPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [event, setEvent] = useState<EventProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id || typeof id !== 'string') return;

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

  const enabledTiers = event?.ticketTiers?.filter((t) => t.enabled) ?? [];

  useEffect(() => {
    if (!event) return;
    const tiers = event.ticketTiers?.filter((t) => t.enabled) ?? [];
    if (tiers.length === 1) {
      router.replace(`/events/${event._id}/checkout?tier=${tiers[0].type}`);
    }
  }, [event, router]);

  if (isLoading || (event && enabledTiers.length === 1)) {
    return (
      <div
        className="flex h-dvh items-center justify-center"
        style={{ backgroundColor: TICKET_BLUE }}
      >
        <Loader className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  if (!event || enabledTiers.length === 0) {
    return (
      <TicketFlowShell title="Get Tickets" backHref="/" centerContent={false}>
        <div className="mx-auto w-full max-w-[400px] pt-2">
          <TicketFlowCard>
            <p className="text-center text-sm text-gray-600">
              No tickets available for this event.
            </p>
            <Link
              href="/"
              className="mt-4 block text-center text-sm font-semibold"
              style={{ color: TICKET_BLUE }}
            >
              Back to events
            </Link>
          </TicketFlowCard>
        </div>
      </TicketFlowShell>
    );
  }

  return (
    <TicketFlowShell title="Get Tickets" backHref="/" centerContent={false}>
      <div className="mx-auto w-full max-w-[400px] flex-1 overflow-y-auto pt-1 pb-2 md:max-w-5xl md:flex md:items-center md:px-4 md:py-4">
        <TicketTierPicker event={event} tiers={enabledTiers} />
      </div>
    </TicketFlowShell>
  );
};

export default TicketTiersPage;
