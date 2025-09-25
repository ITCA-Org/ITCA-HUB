import { useState } from 'react';
import {
  Edit,
  Clock,
  Users,
  MapPin,
  Trash2,
  XCircle,
  UserPlus,
  Calendar,
  UserMinus,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { EventCardProps } from '@/types/interfaces/event';
import ConfirmationModal from '../../modals/confirmation-modal';

const EventCard = ({
  role,
  event,
  onEdit,
  onDelete,
  onRegister,
  onUnregister,
  currentUserId,
}: EventCardProps) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
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

  /**===============================
   * Check if user is registered
   ===============================*/
  const isRegistered =
    role === 'student' && currentUserId
      ? event.attendees.some((attendee) => attendee._id === currentUserId)
      : false;

  /**===============================
   * Handle registration
   ===============================*/
  const handleRegistration = () => {
    setShowConfirmationModal(true);
  };

  const handleConfirmRegistration = async () => {
    if (!onRegister || !onUnregister) return;

    setIsRegistering(true);
    try {
      if (isRegistered) {
        await onUnregister(event._id);
      } else {
        await onRegister(event._id);
      }
      setShowConfirmationModal(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      toast.error('Registration Error', {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsRegistering(false);
    }
  };

  /**====================================
   * Check if registration is available
   ====================================*/
  const canRegister =
    event.registrationRequired &&
    event.status === 'upcoming' &&
    event.attendees.length < event.capacity;

  const isFull = event.attendees.length >= event.capacity;
  const statusConfig = getStatusConfig(event.status);

  return (
    <div className="group relative overflow-hidden rounded-xl border-none bg-white/60">
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
          <div className="h-full w-full bg-gradient-to-br from-blue-500 via-amber-300 to-blue-500 flex items-center justify-center">
            <Calendar className="h-16 w-16 text-white/80" />
          </div>
        )}
      </div>
      {/*==================== End of Event Image ====================*/}

      {/*==================== Event Content ====================*/}
      <div className="p-6">
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

          {/*==================== Admin Actions ====================*/}
          {role === 'admin' && (
            <div className="ml-3 flex space-x-1">
              <button
                title="Edit event"
                onClick={() => onEdit?.(event._id)}
                className="rounded-md p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                title="Delete event"
                onClick={() => onDelete?.(event._id)}
                className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
          {/*==================== End of Admin Actions ====================*/}
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
            <Clock className="mr-2 h-4 w-4 text-amber-500" />
            <span className="text-gray-500">{formatTimeRange()}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4 text-red-500" />
            <span className="line-clamp-1 text-gray-500">{event.location}</span>
          </div>
          <div className="flex items-center">
            <Users className="mr-2 h-4 w-4 text-green-500" />
            <span className="text-gray-500">
              {event.attendees.length} / {event.capacity} registered
            </span>
          </div>
        </div>
        {/*==================== End of Event Details ====================*/}

        {/*==================== Student Registration Section ====================*/}
        {role === 'student' && event.registrationRequired && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            {isRegistered ? (
              <div className="space-y-3">
                <button
                  disabled={isRegistering}
                  onClick={handleRegistration}
                  className="w-full inline-flex justify-center items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  {isRegistering ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Unregistering...
                    </>
                  ) : (
                    <>
                      <UserMinus className="h-4 w-4 mr-2" />
                      Unregister
                    </>
                  )}
                </button>
              </div>
            ) : canRegister ? (
              <button
                disabled={isRegistering}
                onClick={handleRegistration}
                className="w-full inline-flex justify-center items-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-sm font-medium text-white hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {isRegistering ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Registering...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Register
                  </>
                )}
              </button>
            ) : (
              <button
                disabled
                className="w-full inline-flex justify-center items-center rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-500 cursor-not-allowed"
              >
                <XCircle className="h-4 w-4 mr-2" />
                {isFull
                  ? 'Event Full'
                  : event.status === 'completed'
                    ? 'Event Completed'
                    : 'Registration Closed'}
              </button>
            )}
          </div>
        )}

        {/*==================== No Registration Required ====================*/}
        {role === 'student' && !event.registrationRequired && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-center text-sm text-green-600 font-medium">
              <CheckCircle className="inline h-4 w-4 mr-1" />
              No registration required - Join anytime!
            </div>
          </div>
        )}
        {/*==================== End of No Registration Required ====================*/}
      </div>
      {/*==================== End of Event Content ====================*/}

      {/*==================== Registration Confirmation Modal ====================*/}
      <ConfirmationModal
        cancelText="Cancel"
        isLoading={isRegistering}
        isOpen={showConfirmationModal}
        onConfirm={handleConfirmRegistration}
        variant={isRegistered ? 'danger' : 'primary'}
        onClose={() => setShowConfirmationModal(false)}
        confirmText={isRegistered ? 'Unregister' : 'Register'}
        loadingText={isRegistered ? 'Unregistering...' : 'Registering...'}
        title={isRegistered ? 'Confirm Unregistration' : 'Confirm Registration'}
        icon={isRegistered ? <UserMinus className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
        message={`Are you sure you want to ${isRegistered ? 'unregister from' : 'register for'} "${event.title}"?`}
      />
      {/*==================== End of Registration Confirmation Modal ====================*/}
    </div>
  );
};

export default EventCard;
