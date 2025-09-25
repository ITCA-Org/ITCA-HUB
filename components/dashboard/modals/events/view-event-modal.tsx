import Image from 'next/image';
import { X, Users, User } from 'lucide-react';
import useEvents from '@/hooks/events/use-event';
import React, { useEffect, useState } from 'react';
import { ViewEventModalProps, EventProps } from '@/types/interfaces/event';
import ViewEventModalSkeleton from '../../skeletons/view-event-modal-skeleton';

const ViewEventModal = ({ isOpen, eventId, token, onClose }: ViewEventModalProps) => {
  const [event, setEvent] = useState<EventProps | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { getEventById } = useEvents({ token });

  useEffect(() => {
    const fetchEvent = async () => {
      if (!isOpen || !eventId) return;

      setIsLoading(true);
      setError(null);

      try {
        const eventData = await getEventById(eventId);
        setEvent(eventData);
      } catch (err) {
        setError('Failed to load event details');
        console.error('Error fetching event:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [isOpen, eventId, getEventById]);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (!isOpen) return null;

  if (isLoading || (!event && !error)) {
    return <ViewEventModalSkeleton />;
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl w-full mx-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-center text-gray-500">{error}</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto relative hide-scrollbar">
        <div>
          <div className="flex items-center justify-between w-full mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{event.title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {event.imageUrl && (
            <div className="mb-6">
              <div className="rounded-lg overflow-hidden">
                <Image
                  width={800}
                  height={256}
                  alt={event.title}
                  src={event.imageUrl}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {event.description && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3 text-gray-900">Description</h3>
              <p className="text-gray-600 bg-gray-50 rounded-lg p-4">{event.description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 mb-6 border-t border-b">
            <div className="rounded-lg p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <p className="text-md text-gray-500 mb-1">Created At</p>
                <p className="text-md font-medium text-gray-900">
                  {formatDateTime(event.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-md text-gray-500 mb-1">Last Updated</p>
                <p className="text-md font-medium text-gray-900">
                  {formatDateTime(event.updatedAt)}
                </p>
              </div>
            </div>

            <div className="rounded-lg p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <p className="text-md text-gray-500 mb-1">Created By</p>
                <p className="text-md font-medium text-gray-900">
                  {event.createdBy.firstName} {event.createdBy.lastName}
                </p>
                <p className="text-md text-gray-500">{event.createdBy.schoolEmail}</p>
              </div>
              <div>
                <p className="text-md text-gray-500 mb-1">Last Updated By</p>
                {event.updatedBy ? (
                  <>
                    <p className="text-md font-medium text-gray-900">
                      {event.updatedBy.firstName} {event.updatedBy.lastName}
                    </p>
                    <p className="text-md text-gray-500">{event.updatedBy.schoolEmail}</p>
                  </>
                ) : (
                  <>
                    <p className="text-md font-medium text-gray-900">
                      {event.createdBy.firstName} {event.createdBy.lastName}
                    </p>
                    <p className="text-md text-gray-500">{event.createdBy.schoolEmail}</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Attendees</h3>
              <span className="text-md text-gray-500">
                {event.attendees.length} {event.attendees.length === 1 ? 'attendee' : 'attendees'}
              </span>
            </div>

            {event.attendees.length > 0 ? (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {event.attendees.map((attendee, index) => (
                    <div
                      key={attendee._id}
                      className="flex items-center space-x-3 bg-white p-3 rounded-lg"
                    >
                      <div className="bg-blue-100 p-2 rounded-full">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {attendee.firstName} {attendee.lastName}
                        </p>
                        <p className="text-md text-gray-500">{attendee.schoolEmail}</p>
                      </div>
                      <span className="text-md text-gray-400">#{index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No attendees registered</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEventModal;
