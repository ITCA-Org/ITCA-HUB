import { useState } from 'react';
import EventCard from './event-card';
import useDebounce from '@/utils/debounce';
import useEvents, { useEventActions } from '@/hooks/events/use-event';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import EditEventModal from '@/components/dashboard/modals/events/edit-event-modal';
import ViewEventModal from '@/components/dashboard/modals/events/view-event-modal';
import EventCardSkeleton from '@/components/dashboard/skeletons/event-card-skeleton';
import DashboardPageHeader from '@/components/dashboard/layout/dashboard-page-header';
import CreateEventModal from '@/components/dashboard/modals/events/create-event-modal';
import DeleteEventModal from '@/components/dashboard/modals/events/delete-event-modal';
import { NetworkError, EmptyState, NoResults } from '@/components/dashboard/error-messages';
import { Calendar, Search, RefreshCw, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { CreateEventData, EventProps, EventsComponentProps } from '@/types/interfaces/event';

const LIMIT = 9;

const EventsComponent = ({ role, token, userId }: EventsComponentProps) => {
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [eventToView, setEventToView] = useState<string | null>(null);
  const [eventToEdit, setEventToEdit] = useState<EventProps | null>(null);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 500);

  const { events, total, totalPages, isLoading, isError, refresh } = useEvents({
    token,
    page,
    limit: LIMIT,
    status,
    search: debouncedSearch,
  });

  const { createEvent, updateEvent, deleteEvent, registerForEvent, unregisterFromEvent } =
    useEventActions(token);

  const hasActiveFilters = status !== 'all' || searchTerm.trim() !== '';
  const startIndex = page * LIMIT;
  const endIndex = Math.min(startIndex + LIMIT, total);

  const handleCreateEvent = async (eventData: CreateEventData) => {
    try {
      await createEvent(eventData);
      setShowCreateModal(false);
    } catch {
    }
  };

  const handleEditEvent = async (eventId: string, eventData: CreateEventData) => {
    try {
      await updateEvent(eventId, eventData);
      setShowEditModal(false);
      setEventToEdit(null);
    } catch {
    }
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;
    try {
      await deleteEvent(eventToDelete);
      setShowDeleteModal(false);
      setEventToDelete(null);
    } catch {
    }
  };

  const handleRegister = async (eventId: string) => {
    try {
      await registerForEvent(eventId);
    } catch {
    }
  };

  const handleUnregister = async (eventId: string) => {
    try {
      await unregisterFromEvent(eventId);
    } catch {
    }
  };

  const handleEditClick = (eventId: string) => {
    const event = events.find((e) => e._id === eventId);
    if (event) {
      setEventToEdit(event);
      setShowEditModal(true);
    }
  };

  const handleDeleteClick = (eventId: string) => {
    setEventToDelete(eventId);
    setShowDeleteModal(true);
  };

  const handleViewClick = (eventId: string) => {
    setEventToView(eventId);
    setShowViewModal(true);
  };

  const resetFilters = () => {
    setStatus('all');
    setSearchTerm('');
    setPage(0);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers: number[] = [];
    const maxVisible = 5;
    let start = Math.max(0, page - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible);

    if (end - start < maxVisible) {
      start = Math.max(0, end - maxVisible);
    }

    for (let i = start; i < end; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-between bg-transparent border-t border-gray-200 pt-4">
        <div className="flex justify-between flex-1 sm:hidden">
          <button
            disabled={page === 0}
            onClick={() => setPage(Math.max(0, page - 1))}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page === totalPages - 1}
            className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>

        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
              <span className="font-medium">{endIndex}</span> of{' '}
              <span className="font-medium">{total}</span> results
            </p>
          </div>

          <div>
            <nav className="relative z-0 inline-flex rounded-md -space-x-px">
              <button
                disabled={page === 0}
                onClick={() => setPage(Math.max(0, page - 1))}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {pageNumbers.map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`relative inline-flex items-center px-4 py-0 border-none rounded-md text-sm font-medium ${
                    pageNum === page ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {pageNum + 1}
                </button>
              ))}

              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page === totalPages - 1}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout title="Events" token={token}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <DashboardPageHeader
          title="ITCA"
          subtitle="Events"
          description="Manage and discover campus events"
          actions={
            <div className="flex items-center space-x-3">
              <button
                onClick={refresh}
                className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>

              {role === 'admin' && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center rounded-lg bg-linear-to-r from-blue-600 to-blue-500 px-4 py-2 text-sm font-medium text-white hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </button>
              )}
            </div>
          }
        />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="col-span-2">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0);
              }}
              placeholder="Search events by title, description, or location..."
              className="w-full rounded-lg border-none bg-white pl-10 pr-4 py-2.5 text-sm text-gray-700 focus:bg-gray-200/60 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <select
            value={status}
            title="select"
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(0);
            }}
            className="w-full rounded-lg border-none bg-white py-2.5 pl-3 pr-8 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="all">All Events</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <button
            onClick={resetFilters}
            disabled={!hasActiveFilters}
            className={`w-full rounded-lg px-4 py-2.5 text-sm font-medium ${
              hasActiveFilters
                ? 'bg-white text-gray-700 hover:bg-gray-200'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Reset Filters
          </button>
        </div>
      </div>

      {isLoading ? (
        <EventCardSkeleton />
      ) : isError ? (
        <NetworkError
          onRetry={refresh}
          title="Unable to fetch events"
          description="Please check your internet connection and try again."
        />
      ) : events.length === 0 ? (
        hasActiveFilters ? (
          <NoResults
            filterTerm={searchTerm}
            title="No matching events"
            onClearFilters={resetFilters}
            clearButtonText="Clear All Filters"
            description={`No events match your current search${status !== 'all' ? ` and ${status} filter` : ''}. Try adjusting your criteria.`}
          />
        ) : (
          <EmptyState
            itemName="event"
            uploadIcon={Calendar}
            title="No events found"
            showRefreshButton={true}
            onRefresh={refresh}
            showUploadButton={role === 'admin'}
            description={
              role === 'admin'
                ? 'There are no events at the moment. Create an event.'
                : 'No events at the moment. ITCA is organizing exciting events and they will appear here.'
            }
          />
        )
      ) : (
        <div className="bg-transparent">
          <div className="py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard
                  role={role}
                  event={event}
                  key={event._id}
                  onEdit={handleEditClick}
                  onView={handleViewClick}
                  onRegister={handleRegister}
                  onDelete={handleDeleteClick}
                  onUnregister={handleUnregister}
                  currentUserId={userId ?? undefined}
                />
              ))}
            </div>
          </div>

          {events.length > 0 && renderPagination()}
        </div>
      )}

      {showViewModal && eventToView && (
        <ViewEventModal
          role={role}
          token={token}
          isOpen={showViewModal}
          eventId={eventToView}
          onClose={() => {
            setShowViewModal(false);
            setEventToView(null);
          }}
        />
      )}

      {role === 'admin' && (
        <>
          {showCreateModal && (
            <CreateEventModal
              isOpen={showCreateModal}
              onClose={() => setShowCreateModal(false)}
              onSave={handleCreateEvent}
            />
          )}

          {showEditModal && eventToEdit && (
            <EditEventModal
              event={eventToEdit}
              isOpen={showEditModal}
              onClose={() => {
                setShowEditModal(false);
                setEventToEdit(null);
              }}
              onSave={handleEditEvent}
            />
          )}

          {showDeleteModal && (
            <DeleteEventModal
              isOpen={showDeleteModal}
              onClose={() => {
                setShowDeleteModal(false);
                setEventToDelete(null);
              }}
              onConfirm={handleDeleteEvent}
            />
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default EventsComponent;
