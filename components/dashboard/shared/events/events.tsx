import EventCard from './event-card';
import useEvents from '@/hooks/events/use-event';
import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import { NetworkError, EmptyState } from '@/components/dashboard/error-messages';
import EditEventModal from '@/components/dashboard/modals/events/edit-event-modal';
import EventCardSkeleton from '@/components/dashboard/skeletons/event-card-skeleton';
import DashboardPageHeader from '@/components/dashboard/layout/dashboard-page-header';
import CreateEventModal from '@/components/dashboard/modals/events/create-event-modal';
import DeleteEventModal from '@/components/dashboard/modals/events/delete-event-modal';
import { Calendar, Search, RefreshCw, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { CreateEventData, EventProps, EventsComponentProps } from '@/types/interfaces/event';

const EventsComponent = ({ role, userData }: EventsComponentProps) => {
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [eventToEdit, setEventToEdit] = useState<EventProps | null>(null);
  const [events, setEvents] = useState<EventProps[] | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const limit = 9;

  const {
    isError,
    isLoading,
    searchTerm,
    createEvent,
    updateEvent,
    deleteEvent,
    getAllEvents,
    setSearchTerm,
    registerForEvent,
    unregisterFromEvent,
  } = useEvents({ token: userData.token });

  /**===================
   * Load events data
   ===================*/
  const loadEvents = useCallback(async () => {
    const response = await getAllEvents({
      page,
      limit,
      status: status !== 'all' ? status : undefined,
    });

    setEvents(response.events);
    setTotalEvents(response.total);
    setTotalPages(response.pagination.totalPages || Math.ceil(response.total / limit));
  }, [page, limit, status, getAllEvents]);

  /**===============================
   * Event handlers for admin
   ===============================*/
  const handleCreateEvent = async (eventData: CreateEventData) => {
    await createEvent(eventData);
    setShowCreateModal(false);
    loadEvents();
  };

  const handleEditEvent = async (eventId: string, eventData: CreateEventData) => {
    await updateEvent(eventId, eventData);
    setShowEditModal(false);
    setEventToEdit(null);
    loadEvents();
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;
    await deleteEvent(eventToDelete);
    setShowDeleteModal(false);
    setEventToDelete(null);
    loadEvents();
  };

  /**===============================
   * Event handlers for students
   ===============================*/
  const handleRegister = async (eventId: string) => {
    await registerForEvent(eventId);
    loadEvents();
  };

  const handleUnregister = async (eventId: string) => {
    await unregisterFromEvent(eventId);
    loadEvents();
  };

  /**===================
   * Refresh handler
   ===================*/
  const handleRefresh = () => {
    setSearchTerm('');
    setStatus('all');
    setPage(1);
    loadEvents();
  };

  /**===================
   * Modal handlers
   ===================*/
  const handleEditClick = (eventId: string) => {
    const event = events?.find((e) => e._id === eventId);
    if (event) {
      setEventToEdit(event);
      setShowEditModal(true);
    }
  };

  const handleDeleteClick = (eventId: string) => {
    setEventToDelete(eventId);
    setShowDeleteModal(true);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatus('all');
    setPage(1);
  };

  /**===============================
   * Get current user ID for students
   ===============================*/
  useEffect(() => {
    if (role === 'student') {
      setCurrentUserId(userData.userId || '');
    }
  }, [role, userData]);

  /**=====================================
   * Load events when dependencies change
   =====================================*/
  useEffect(() => {
    const abortController = new AbortController();
    let isActive = true;

    const loadData = async () => {
      try {
        if (isActive) {
          const response = await getAllEvents({
            page,
            limit,
            status: status !== 'all' ? status : undefined,
            signal: abortController.signal,
          });

          if (isActive) {
            setEvents(response.events);
            setTotalEvents(response.total);
            setTotalPages(response.pagination.totalPages || Math.ceil(response.total / limit));
          }
        }
      } catch (error) {
        if (isActive && !(error instanceof Error && error.name === 'AbortError')) {
          console.error('Failed to load events:', error);
        }
      }
    };

    loadData();

    return () => {
      isActive = false;
      abortController.abort();
    };
  }, [page, limit, status, getAllEvents]);

  /**===============================
   * Reset page when filters change
   ===============================*/
  useEffect(() => {
    setPage(1);
  }, [status]);

  /**===============================
   * Pagination handlers
   ===============================*/
  const handlePreviousPage = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setPage((prev) => Math.min(totalPages, prev + 1));
  };

  const handlePageClick = (pageNum: number) => {
    setPage(pageNum);
  };

  /**===============================
   * Render pagination component
   ===============================*/
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-between bg-transparent border-t border-gray-200 pt-4">
        <div className="flex justify-between flex-1 sm:hidden">
          <button
            disabled={page === 1}
            onClick={handlePreviousPage}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>

        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
              <span className="font-medium">{Math.min(page * limit, totalEvents)}</span> of{' '}
              <span className="font-medium">{totalEvents}</span> results
            </p>
          </div>

          <div>
            <nav className="relative z-0 inline-flex rounded-md -space-x-px">
              <button
                disabled={page === 1}
                onClick={handlePreviousPage}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {pageNumbers.map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageClick(pageNum)}
                  className={`relative inline-flex items-center px-4 py-0 border-none rounded-md text-sm font-medium ${
                    pageNum === page ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={handleNextPage}
                disabled={page === totalPages}
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
    <DashboardLayout title="Events" token={userData.token}>
      {/*==================== Page Header ====================*/}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <DashboardPageHeader
          title="ITCA"
          subtitle="Events"
          description="Manage and discover campus events"
          actions={
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>

              {role === 'admin' && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-sm font-medium text-white hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </button>
              )}
            </div>
          }
        />
      </div>
      {/*==================== End of Page Header ====================*/}

      {/*==================== Filters ====================*/}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="col-span-2">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search events by title, description, or location..."
              className="w-full rounded-lg border-none bg-white pl-10 pr-4 py-2.5 text-sm text-gray-700 focus:bg-gray-200/60 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <select
            value={status}
            title="select"
            onChange={(e) => setStatus(e.target.value)}
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
            className="w-full rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Reset Filters
          </button>
        </div>
      </div>
      {/*==================== End of Filters ====================*/}

      {/*==================== Content Area ====================*/}
      {isLoading || events === null ? (
        <EventCardSkeleton />
      ) : isError ? (
        <NetworkError
          onRetry={handleRefresh}
          title="Unable to fetch events"
          description="Please check your internet connection and try again."
        />
      ) : events.length === 0 ? (
        <EmptyState
          itemName="event"
          uploadIcon={Calendar}
          title="No events found"
          showRefreshButton={true}
          onRefresh={handleRefresh}
          showUploadButton={role === 'admin'}
          uploadUrl={role === 'admin' ? '/events' : '/help'}
          description={
            status === 'all'
              ? 'There are no events at the moment. Check back later!'
              : `No ${status} events found. Try adjusting your filter(s).`
          }
          uploadButtonText={role === 'admin' ? 'Create Event' : 'Go To Dashboard'}
        />
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
                  onRegister={handleRegister}
                  onDelete={handleDeleteClick}
                  currentUserId={currentUserId}
                  onUnregister={handleUnregister}
                />
              ))}
            </div>
          </div>

          {/*==================== Pagination ====================*/}
          {events.length > 0 && renderPagination()}
          {/*==================== End of Pagination ====================*/}
        </div>
      )}
      {/*==================== End of Content Area ====================*/}

      {/*==================== Admin Modals ====================*/}
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
      {/*==================== End of Admin Modals ====================*/}
    </DashboardLayout>
  );
};

export default EventsComponent;
