import {
  Edit,
  Clock,
  Users,
  MapPin,
  Trash2,
  EyeIcon,
  Calendar,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { EventCardProps } from '@/types/interfaces/event';

const EventCard = ({
  role,
  event,
  onEdit,
  onView,
  onDelete,
}: EventCardProps) => {
  const [imageError, setImageError] = useState(false);

  /**===============================
   * Format date for display
   ===============================*/
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  /**===============================
   * Format time for display
   ===============================*/
  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return timeString;
    }
  };

  /**===============================
   * Format date range for display
   ===============================*/
  const formatDateRange = () => {
    const startDate = formatDate(event.date);

    if (!event.toDate) {
      return startDate;
    }

    const endDate = formatDate(event.toDate);
    const startDateObj = new Date(event.date);
    const endDateObj = new Date(event.toDate);

    if (startDateObj.toDateString() === endDateObj.toDateString()) {
      return startDate;
    }

    return `${startDate} - ${endDate}`;
  };

  /**===============================
   * Format time range for display
   ===============================*/
  const formatTimeRange = () => {
    const startTime = formatTime(event.time);

    if (!event.toTime) {
      return startTime;
    }

    if (event.toDate) {
      const startDateObj = new Date(event.date);
      const endDateObj = new Date(event.toDate);

      if (startDateObj.toDateString() !== endDateObj.toDateString()) {
        const endTime = formatTime(event.toTime);
        return `Start: ${startTime} • End: ${endTime}`;
      }
    }

    const endTime = formatTime(event.toTime);
    return `${startTime} - ${endTime}`;
  };

  /**===============================
   * Get status color and text
   ===============================*/
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'upcoming':
        return {
          color: 'bg-blue-100 text-blue-800',
          text: 'Upcoming',
        };
      case 'ongoing':
        return {
          color: 'bg-amber-100 text-amber-800',
          text: 'Ongoing',
        };
      case 'completed':
        return {
          color: 'bg-green-100 text-green-800',
          text: 'Completed',
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          text: 'Unknown',
        };
    }
  };

  const isFull = event.attendees.length >= event.capacity;
  const statusConfig = getStatusConfig(event.status);

  return (
    <div className="group relative overflow-hidden rounded-xl border-none bg-white/70">
      {/*==================== Event Image ====================*/}
      <div className="aspect-video w-full overflow-hidden relative">
        {event.imageUrl && !imageError ? (
          <Image
            fill
            priority
            alt={event.title}
            src={event.imageUrl}
            onError={() => setImageError(true)}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-linear-to-br from-blue-500 via-amber-300 to-blue-500 flex items-center justify-center">
            <Calendar className="h-16 w-16 text-white/80" />
          </div>
        )}
      </div>
      {/*==================== End of Event Image ====================*/}

      {/*==================== Event Content ====================*/}
      <div className="px-6 pt-6 pb-3">
        {/*==================== Event Header ====================*/}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="mb-2 text-lg font-semibold text-gray-900 line-clamp-2">{event.title}</h3>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-sm font-medium ${statusConfig.color}`}
            >
              {statusConfig.text}
            </span>
          </div>

          {/*==================== Actions ====================*/}
          <div className="ml-3 flex space-x-1">
            <button
              title="View Event Details"
              onClick={() => onView?.(event._id)}
              className="rounded-md p-1.5 text-gray-400 hover:bg-green-50 hover:text-green-400 transition-colors cursor-pointer"
            >
              <EyeIcon className="h-4 w-4" />
            </button>
            {role === 'admin' && (
              <>
                <button
                  title="Edit event"
                  onClick={() => onEdit?.(event._id)}
                  className="rounded-md p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-500 transition-colors cursor-pointer"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  title="Delete event"
                  onClick={() => onDelete?.(event._id)}
                  className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
          {/*==================== End of Actions ====================*/}
        </div>
        {/*==================== End of Event Header ====================*/}

        {/*==================== Event Description ====================*/}
        <p className="mb-4 text-md text-gray-600 line-clamp-2">{event.description}</p>
        {/*==================== End of Event Description ====================*/}

        {/*==================== Event Details ====================*/}
        <div className="space-y-4 pt-2 text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-blue-500" />
            <span className="text-gray-500">{formatDateRange()}</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-blue-500" />
            <span className="text-gray-500">{formatTimeRange()}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4 text-blue-500" />
            <span className="line-clamp-1 text-gray-500">{event.location}</span>
          </div>
          {event.registrationRequired && (
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4 text-blue-500" />
              <span className="text-gray-500">
                {event.attendees.length} / {event.capacity} registered
              </span>
            </div>
          )}
        </div>
        {/*==================== End of Event Details ====================*/}

        {/*==================== Admin Registration Message ====================*/}
        {role === 'admin' && event.registrationRequired && (
          <div className="mt-6 pt-4 pb-2 border-t border-gray-300">
            <div className="text-center text-sm text-gray-500 font-medium">
              Admins cannot register for events.
            </div>
          </div>
        )}
        {/*==================== End of Admin Registration Message ====================*/}

        {/*==================== No Registration Required ====================*/}
        {!event.registrationRequired && (
          <div className="mt-6 pt-4 pb-2 border-t border-gray-300">
            <div className="text-center text-sm text-green-600 font-medium">
              No registration required - Join anytime.
            </div>
          </div>
        )}
        {/*==================== End of No Registration Required ====================*/}
      </div>
      {/*==================== End of Event Content ====================*/}
    </div>
  );
};

export default EventCard;
