import { useMemo, useState } from 'react';
import { Filter, Plus, Search, Ticket, X } from 'lucide-react';
import { EventProps } from '@/types/interfaces/event';
import { CreateTicketData, TicketProps } from '@/types/interfaces/ticket';
import CreateTicketForm from './create-ticket-form';
import ScanTicketModal from './scan-ticket-modal';
import TicketCard from './ticket-card';
import TicketDetailsModal from './ticket-details-modal';

interface TicketListProps {
  tickets: TicketProps[];
  isLoading: boolean;
  isAdmin?: boolean;
  eventId?: string;
  events: EventProps[];
  isLoadingEvents: boolean;
  onCreateTicket: (data: CreateTicketData) => Promise<void>;
  onDeleteTicket: (ticketId: string) => Promise<void>;
  onScanTicket: (barcode: string) => Promise<import('@/types/interfaces/ticket').ScanResult>;
}

type TypeFilter = 'all' | TicketProps['ticketType'];
type StatusFilter = 'all' | 'active' | 'scanned';

const TicketList = ({
  tickets,
  isLoading,
  isAdmin = false,
  eventId,
  events,
  isLoadingEvents,
  onCreateTicket,
  onDeleteTicket,
  onScanTicket,
}: TicketListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [scanBarcode, setScanBarcode] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<TicketProps | null>(null);

  const filteredTickets = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return tickets.filter((ticket) => {
      const matchesSearch =
        !search ||
        ticket.attendeeName.toLowerCase().includes(search) ||
        ticket.email?.toLowerCase().includes(search) ||
        ticket.phoneNumber.toLowerCase().includes(search) ||
        ticket.barcode.toLowerCase().includes(search);
      const matchesType = typeFilter === 'all' || ticket.ticketType === typeFilter;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && !ticket.scanned) ||
        (statusFilter === 'scanned' && ticket.scanned);

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [tickets, searchTerm, typeFilter, statusFilter]);

  const activeCount = tickets.filter((ticket) => !ticket.scanned).length;
  const scannedCount = tickets.length - activeCount;
  const hasFilters = Boolean(searchTerm.trim()) || typeFilter !== 'all' || statusFilter !== 'all';

  const resetFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setStatusFilter('all');
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-700">Tickets</p>
          <h1 className="text-2xl font-bold text-gray-950">Event Admissions</h1>
          <p className="mt-1 text-sm text-gray-600">
            {tickets.length} issued, {activeCount} active, {scannedCount} scanned
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {isAdmin && (
            <button
              type="button"
              onClick={() => setScanBarcode('')}
              className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100"
            >
              <Ticket className="h-4 w-4" />
              Scan Ticket
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Issue Ticket
          </button>
        </div>
      </div>

      <div className="grid gap-3 rounded-lg bg-white p-4 shadow-sm md:grid-cols-[1fr_160px_160px_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search name, phone, email, or barcode"
            className="w-full rounded-md border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(event) => setTypeFilter(event.target.value as TypeFilter)}
          className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="all">All Types</option>
          <option value="Student">Student</option>
          <option value="VIP">VIP</option>
        </select>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
          className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="scanned">Scanned</option>
        </select>
        <button
          type="button"
          onClick={resetFilters}
          disabled={!hasFilters}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Filter className="h-4 w-4" />
          Reset
        </button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-72 animate-pulse rounded-lg bg-white shadow-sm" />
          ))}
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="rounded-lg bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
            <Ticket className="h-7 w-7 text-blue-500" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-gray-950">No tickets found</h2>
          <p className="mt-1 text-sm text-gray-600">
            {tickets.length === 0 ? 'Issued tickets will appear here.' : 'Try changing the search or filters.'}
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              <X className="h-4 w-4" />
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredTickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              isAdmin={isAdmin}
              onDelete={onDeleteTicket}
              onScan={setScanBarcode}
              onViewDetails={setSelectedTicket}
            />
          ))}
        </div>
      )}

      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-950">Issue Ticket</h2>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="rounded-md p-1 text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <CreateTicketForm
                eventId={eventId}
                events={events}
                isLoadingEvents={isLoadingEvents}
                onCancel={() => setShowCreateForm(false)}
                onSubmit={async (data) => {
                  await onCreateTicket(data);
                  setShowCreateForm(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {scanBarcode !== null && (
        <ScanTicketModal
          initialBarcode={scanBarcode}
          onClose={() => setScanBarcode(null)}
          onScan={onScanTicket}
        />
      )}

      {selectedTicket && (
        <TicketDetailsModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
      )}
    </section>
  );
};

export default TicketList;
