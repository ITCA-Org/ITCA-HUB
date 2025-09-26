import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, ArrowRight, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

type Event = {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  toDate?: string;
  toTime?: string;
  location: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  registrationRequired: boolean;
  imageUrl?: string;
  capacity: number;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    schoolEmail: string;
  };
  attendees: Array<{
    _id: string;
    firstName: string;
    lastName: string;
    schoolEmail: string;
  }>;
  createdAt: string;
  updatedAt: string;
};

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
const formatDateRange = (event: Event) => {
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
const formatTimeRange = (event: Event) => {
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

const EventCard = ({ event, index }: { event: Event; index: number }) => {
  const [imageError, setImageError] = useState(false);
  const statusConfig = getStatusConfig(event.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
      }}
      className="group relative overflow-hidden rounded-xl border-none bg-white/60"
    >
      {/*==================== End of Error details (subtle) ====================*/}
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
        </div>
        {/*==================== End of Event Header ====================*/}

        {/*==================== Event Description ====================*/}
        <p className="mb-4 text-md text-gray-600 line-clamp-2">{event.description}</p>
        {/*==================== End of Event Description ====================*/}

        {/*==================== Event Details ====================*/}
        <div className="space-y-4 pt-2 text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-blue-500" />
            <span className="text-gray-500">{formatDateRange(event)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-amber-500" />
            <span className="text-gray-500">{formatTimeRange(event)}</span>
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

        {/*==================== Landing Page Registration Section ====================*/}
        {event.registrationRequired && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link href="/auth" className="cursor-pointer">
              <button className="w-full inline-flex justify-center items-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-sm font-medium text-white hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg">
                <ArrowRight className="h-4 w-4 mr-2" />
                Register Now
              </button>
            </Link>
          </div>
        )}

        {/*==================== No Registration Required ====================*/}
        {!event.registrationRequired && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-center text-sm text-green-600 font-medium">
              <Calendar className="inline h-4 w-4 mr-1" />
              No registration required - Join anytime!
            </div>
          </div>
        )}
        {/*==================== End of No Registration Required ====================*/}
      </div>
      {/*==================== End of Event Content ====================*/}
    </motion.div>
  );
};

const EventsSection = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get(
          'https://itca-hub-backend.onrender.com/api/events/upcoming?page=1&limit=6'
        );

        if (response.data.status === 'success') {
          setEvents(response.data.data);
        } else {
          throw new Error('Failed to fetch events');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <section
      id="events"
      style={{ contain: 'layout style' }}
      className="relative py-24 overflow-hidden bg-gradient-to-b from-white to-gray-100"
    >
      <div className="absolute inset-0 z-10 overflow-hidden opacity-20">
        <div className="absolute top-1/4 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-amber-500/40 to-transparent"></div>
        <div className="absolute top-2/4 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-blue-700/40 to-transparent"></div>
        <div className="absolute top-3/4 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-amber-500/40 to-transparent"></div>

        <div className="absolute top-0 left-1/4 h-full w-[1px] bg-gradient-to-b from-transparent via-blue-700/40 to-transparent"></div>
        <div className="absolute top-0 left-2/4 h-full w-[1px] bg-gradient-to-b from-transparent via-amber-500/40 to-transparent"></div>
        <div className="absolute top-0 left-3/4 h-full w-[1px] bg-gradient-to-b from-transparent via-blue-700/40 to-transparent"></div>
      </div>

      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-blue-700/5"></div>
        <div className="absolute -left-20 top-60 h-60 w-60 rounded-full bg-amber-500/5"></div>
        <div className="absolute bottom-20 right-20 h-40 w-40 rounded-full bg-blue-700/5"></div>
      </div>

      <div className="container relative z-20 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 70 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Upcoming <span className="text-blue-700">Events</span>
          </h2>
          <div className="mx-auto h-1 w-24 bg-gradient-to-r from-blue-700 via-amber-500 to-blue-700 rounded-full mb-6"></div>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Stay updated with our latest workshops, conferences, and activities designed to enhance
            your skills and knowledge.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              {/*==================== Error Icon Container ====================*/}
              <div className="relative mb-8">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center border border-red-100">
                  <Calendar className="h-10 w-10 text-red-500" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 border-2 border-red-200 rounded-full"></div>
                    <div className="absolute w-4 h-0.5 bg-red-400 transform rotate-45"></div>
                    <div className="absolute w-4 h-0.5 bg-red-400 transform -rotate-45"></div>
                  </div>
                </div>
                {/*==================== End of Error indicator dots ====================*/}
              </div>
              {/*==================== End of Error Icon Container ====================*/}

              {/*==================== Error Content ====================*/}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-800">Unable to Load Events</h3>
                <p className="text-gray-600 leading-relaxed">
                  We're having trouble connecting to our events service.
                  <br />
                  Please try refreshing the page or check back later.
                </p>

                {/*==================== Error details (subtle) ====================*/}
                {error && (
                  <details className="text-sm text-gray-500 mt-4">
                    <summary className="cursor-pointer hover:text-gray-700">
                      Technical details
                    </summary>
                    <p className="mt-2 p-3 bg-gray-50 rounded text-left font-mono text-xs">
                      {error}
                    </p>
                  </details>
                )}
                {/*==================== End of Error details (subtle) ====================*/}

                {/*==================== Retry CTA ====================*/}
                <div className="pt-4">
                  <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Try Again
                  </button>
                </div>
                {/*==================== End of Retry CTA ====================*/}
              </div>
              {/*==================== End of Error Content ====================*/}
            </div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              {/*==================== Icon Container ====================*/}
              <div className="relative mb-8">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-50 to-amber-50 flex items-center justify-center border border-blue-100">
                  <Calendar className="h-10 w-10 text-blue-600" />
                </div>
                {/*==================== Small decorative dots ====================*/}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full"></div>
                <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-blue-400 rounded-full"></div>
                {/*==================== End of Small decorative dots ====================*/}
              </div>
              {/*==================== End of Icon Container ====================*/}

              {/*==================== Content ====================*/}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-800">No Upcoming Events</h3>
                <p className="text-gray-600 leading-relaxed">
                  We're planning exciting events for the ITCA community.
                  <br />
                  Check back soon or sign in to stay updated!
                </p>

                {/*==================== Simple CTA ====================*/}
                <div className="pt-4">
                  <Link href="/auth">
                    <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
                      <Calendar className="w-4 h-4 mr-2" />
                      Get Notified of Events
                    </button>
                  </Link>
                </div>
                {/*==================== End of Simple CTA ====================*/}
              </div>
              {/*==================== End of Content ====================*/}
            </div>
          </div>
        ) : (
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event, index) => (
              <EventCard key={event._id} event={event} index={index} />
            ))}
          </div>
        )}

        <motion.div
          viewport={{ once: true }}
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 70 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <button className="group relative overflow-hidden rounded-full border-2 border-blue-500 bg-transparent px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base text-blue-500 transition-all duration-300 hover:text-white hover:shadow-lg hover:shadow-blue-500/30">
            <Link href="/auth" className="relative z-10 flex items-center justify-center">
              Sign in to view all events
              <ChevronRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <span className="absolute inset-0 -z-10 translate-y-full bg-blue-500 transition-transform duration-300 group-hover:translate-y-0"></span>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default EventsSection;
