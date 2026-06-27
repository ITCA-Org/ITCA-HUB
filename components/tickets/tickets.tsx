import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import useEvents from '@/hooks/events/use-event';
import useTickets, { useTicketActions } from '@/hooks/tickets/use-ticket';
import { EventProps } from '@/types/interfaces/event';
import { CreateTicketData } from '@/types/interfaces/ticket';
import TicketList from './ticket-list';

interface TicketsComponentProps {
  token: string;
  role: string;
  eventId?: string;
}

const TicketsComponent = ({ token, role, eventId }: TicketsComponentProps) => {
  const isAdmin = role === 'admin' || role === 'event-organizer';
  const { tickets, isLoading, refresh } = useTickets({
    token,
    eventId,
    page: 0,
    limit: 50,
  });
  const { events, isLoading: isLoadingEvents } = useEvents({
    token,
    page: 0,
    limit: 100,
    status: 'all',
  });
  const { createTicket, deleteTicket, scanTicket } = useTicketActions(token);
  const ticketedEvents: EventProps[] = events.filter((event) => event.requiresTicket);

  const handleCreateTicket = async (data: CreateTicketData) => {
    await createTicket(data);
    await refresh();
  };

  const handleDeleteTicket = async (ticketId: string) => {
    await deleteTicket(ticketId);
    await refresh();
  };

  const handleScanTicket = async (barcode: string) => {
    const result = await scanTicket(barcode);
    await refresh();
    return result;
  };

  return (
    <DashboardLayout title="Tickets" token={token}>
      <TicketList
        tickets={tickets}
        isLoading={isLoading}
        isAdmin={isAdmin}
        eventId={eventId}
        events={ticketedEvents}
        isLoadingEvents={isLoadingEvents}
        onCreateTicket={handleCreateTicket}
        onDeleteTicket={handleDeleteTicket}
        onScanTicket={handleScanTicket}
      />
    </DashboardLayout>
  );
};

export default TicketsComponent;
