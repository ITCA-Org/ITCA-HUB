import EventCard from './event-card';
import useEvents from '@/hooks/events/use-event';
import { useState, useEffect, useCallback } from 'react';
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

const EventsComponent = ({ role, userData }: EventsComponentProps) => {
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [eventToEdit, setEventToEdit] = useState<EventProps | null>(null);
  const [eventToView, setEventToView] = useState<string | null>(null);
  const [isClearingFilters, setIsClearingFilters] = useState(false);
  const [events, setEvents] = useState<EventProps[] | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const limit = 9;

  const {
    isError,
    isLoading,
    searchTerm,
    clearCache,
    createEvent,
    updateEvent,
    deleteEvent,
    getAllEvents,
    setSearchTerm,
    registerForEvent,
    unregisterFromEvent,
  } = useEvents({ token: userData.token });

  /**===============================
   * Check if there are active filters
   ===============================*/
  const hasActiveFilters = status !== 'all';

  const loadEvents = useCallback(
    async (signal?: AbortSignal) => {
      const response = await getAllEvents({
        page,
        limit,
        signal,
        status: status !== 'all' ? status : undefined,
      });

      if (!signal?.aborted) {
        setEvents(response.events);
        setTotalEvents(response.total);
        setTotalPages(response.pagination.totalPages || Math.ceil(response.total / limit));
      }
    },
    [page, limit, status, getAllEvents]
  );

  const refreshEvents = useCallback(
    async (signal?: AbortSignal) => {
      try {
        const response = await getAllEvents({
          page,
          limit,
          signal,
          status: status !== 'all' ? status : undefined,
        });

        if (!signal?.aborted) {
          setEvents(response.events);
          setTotalEvents(response.total);
          setTotalPages(response.pagination.totalPages || Math.ceil(response.total / limit));
        }
      } catch (error) {
        if (!signal?.aborted) {
          console.error('Failed to refresh events:', error);
        }
      }
    },
    [page, limit, status, getAllEvents]
  );

  const handleCreateEvent = async (eventData: CreateEventData) => {
    const controller = new AbortController();
    try {
      await createEvent(eventData, controller.signal);
      setShowCreateModal(false);
      refreshEvents(controller.signal);
    } catch (error) {
      if (!controller.signal.aborted) {
        console.error('Failed to create event:', error);
      }
    }
  };

  const handleEditEvent = async (eventId: string, eventData: CreateEventData) => {
    const controller = new AbortController();
    try {
      await updateEvent(eventId, eventData, controller.signal);

      setShowEditModal(false);
      setEventToEdit(null);

      await refreshEvents(controller.signal);
    } catch (error) {
      if (!controller.signal.aborted) {
        console.error('Failed to update event:', error);
      }
    }
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;
    const controller = new AbortController();
    try {
      await deleteEvent(eventToDelete, controller.signal);

      setShowDeleteModal(false);
      setEventToDelete(null);

      await refreshEvents(controller.signal);
    } catch (error) {
      if (!controller.signal.aborted) {
        console.error('Failed to delete event:', error);
      }
    }
  };

  const handleRegister = async (eventId: string) => {
    const controller = new AbortController();
    try {
      await registerForEvent(eventId, controller.signal);
      await refreshEvents(controller.signal);
    } catch (error) {
      if (!controller.signal.aborted) {
        console.error('Failed to register for event:', error);
      }
    }
  };

  const handleUnregister = async (eventId: string) => {
    const controller = new AbortController();
    try {
      await unregisterFromEvent(eventId, controller.signal);
      await refreshEvents(controller.signal);
    } catch (error) {
      if (!controller.signal.aborted) {
        console.error('Failed to unregister from event:', error);
      }
    }
  };

  const handleRefresh = () => {
    setPage(1);
    clearCache();
    const controller = new AbortController();
    loadEvents(controller.signal);
  };

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

  const handleViewClick = async (eventId: string) => {
    setEventToView(eventId);
    setShowViewModal(true);
  };

  const resetFilters = () => {
    if (!hasActiveFilters) return;
    setIsClearingFilters(true);
    setStatus('all');
    setPage(1);
    clearCache();
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

          if (isActive && !abortController.signal.aborted) {
            setEvents(response.events);
            setTotalEvents(response.total);
            setTotalPages(response.pagination.totalPages || Math.ceil(response.total / limit));
            setIsClearingFilters(false);
          }
        }
      } catch (error) {
        if (isActive && !abortController.signal.aborted) {
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
      {/*==================== End of Filters ====================*/}

      {/*==================== Content Area ====================*/}
      {isLoading || isClearingFilters || (!events && !isError) ? (
        <EventCardSkeleton />
      ) : isError ? (
        <NetworkError
          onRetry={handleRefresh}
          title="Unable to fetch events"
          description="Please check your internet connection and try again."
        />
      ) : events && events.length === 0 ? (
        (searchTerm.trim() !== '' || hasActiveFilters) && !isClearingFilters ? (
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
            onRefresh={handleRefresh}
            showUploadButton={role === 'admin'}
            uploadUrl={role === 'admin' ? '/events' : '/help'}
            description="There are no events at the moment. Check back later!"
            uploadButtonText={role === 'admin' ? 'Create Event' : 'Go To Dashboard'}
          />
        )
      ) : (
        <div className="bg-transparent">
          <div className="py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events?.map((event) => (
                <EventCard
                  role={role}
                  event={event}
                  key={event._id}
                  onEdit={handleEditClick}
                  onView={handleViewClick}
                  onRegister={handleRegister}
                  onDelete={handleDeleteClick}
                  currentUserId={currentUserId}
                  onUnregister={handleUnregister}
                />
              ))}
            </div>
          </div>

          {/*==================== Pagination ====================*/}
          {events && events.length > 0 && renderPagination()}
          {/*==================== End of Pagination ====================*/}
        </div>
      )}
      {/*==================== End of Content Area ====================*/}

      {/*==================== View Event Modal ====================*/}
      {showViewModal && eventToView && (
        <ViewEventModal
          isOpen={showViewModal}
          eventId={eventToView}
          token={userData.token}
          onClose={() => {
            setShowViewModal(false);
            setEventToView(null);
          }}
        />
      )}
      {/*==================== End of View Event Modal ====================*/}

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
