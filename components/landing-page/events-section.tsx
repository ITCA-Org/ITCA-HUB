import axios from 'axios';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BASE_URL } from '@/utils/url';
import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Ticket } from 'lucide-react';
import Link from 'next/link';
import { TicketTier } from '@/types/interfaces/event';
import { darkCtaClass } from './brand';

export type Event = {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  toDate?: string;
  toTime?: string;
  location: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  ticketingEnabled: boolean;
  ticketTiers?: TicketTier[];
  imageUrl?: string;
  capacity: number;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    schoolEmail: string;
  };
  createdAt: string;
  updatedAt: string;
};

const mockOrganizer = {
  _id: 'mock-user',
  firstName: 'ITCA',
  lastName: 'Exec',
  schoolEmail: 'itca@utg.edu.gm',
};

/** Preview data when the API has no upcoming events */
export const MOCK_EVENTS: Event[] = [
  {
    _id: 'mock-web-workshop',
    title: 'Web Dev Workshop — Build & Ship',
    description:
      'A hands-on weekend workshop for School of ICT students. HTML, CSS, React basics, and shipping a small project with mentors from ITCA.',
    date: '2026-09-12T00:00:00.000Z',
    time: '2026-09-12T09:00:00.000Z',
    toDate: '2026-09-13T00:00:00.000Z',
    toTime: '2026-09-13T16:00:00.000Z',
    location: 'ICT Lab, Faraba Banta Campus',
    status: 'upcoming',
    ticketingEnabled: true,
    ticketTiers: [
      { type: 'standard', enabled: true, label: 'Student', price: 50 },
      { type: 'premium', enabled: true, label: 'With kit', price: 150 },
    ],
    imageUrl: '/ITCA_WEEK/IMG_4248.jpg',
    capacity: 60,
    createdBy: mockOrganizer,
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
  },
  {
    _id: 'mock-sports-day',
    title: 'ITCA Sports Day 2026',
    description:
      'Football, volleyball, and friendly competitions across School of ICT. Come play, cheer, and meet fellow students outside the lecture hall.',
    date: '2026-09-20T00:00:00.000Z',
    time: '2026-09-20T08:30:00.000Z',
    toTime: '2026-09-20T17:00:00.000Z',
    location: 'UTG Sports Ground, Faraba Banta',
    status: 'upcoming',
    ticketingEnabled: false,
    ticketTiers: [],
    imageUrl: '/ITCA_SPORTS/IMG_8212.jpg',
    capacity: 200,
    createdBy: mockOrganizer,
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
  },
  {
    _id: 'mock-retreat',
    title: 'Leadership Retreat — Show Up',
    description:
      'A one-day retreat for ICT students focused on teamwork, leadership, and community. Workshops, games, and conversations that stick.',
    date: '2026-10-04T00:00:00.000Z',
    time: '2026-10-04T08:00:00.000Z',
    toTime: '2026-10-04T18:00:00.000Z',
    location: 'Senegambia Beach Hotel',
    status: 'upcoming',
    ticketingEnabled: true,
    ticketTiers: [{ type: 'standard', enabled: true, label: 'Standard', price: 200 }],
    imageUrl: '/ITCA_RETREAT/retreat-gathering.jpg',
    capacity: 80,
    createdBy: mockOrganizer,
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
  },
  {
    _id: 'mock-itca-week',
    title: 'UTG-ITCA Week Opening Ceremony',
    description:
      'Kick off ITCA Week with talks, showcases, and the School of ICT community. Open to every ICT student—you’re already part of us.',
    date: '2026-10-18T00:00:00.000Z',
    time: '2026-10-18T10:00:00.000Z',
    toTime: '2026-10-18T13:00:00.000Z',
    location: 'Main Auditorium, Faraba Banta Campus',
    status: 'upcoming',
    ticketingEnabled: false,
    ticketTiers: [],
    imageUrl: '/ITCA_WEEK/IMG_4517.jpg',
    capacity: 300,
    createdBy: mockOrganizer,
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
  },
  {
    _id: 'mock-cyber-workshop',
    title: 'Intro to Cybersecurity Workshop',
    description:
      'Learn the basics of digital security, phishing awareness, and safe practices. No prior experience needed—bring your laptop if you can.',
    date: '2026-11-01T00:00:00.000Z',
    time: '2026-11-01T14:00:00.000Z',
    toTime: '2026-11-01T17:00:00.000Z',
    location: 'Computer Lab B, School of ICT',
    status: 'upcoming',
    ticketingEnabled: true,
    ticketTiers: [{ type: 'standard', enabled: true, label: 'Free entry', price: 0 }],
    imageUrl: '/ITCA_WEEK/IMG_4237.jpg',
    capacity: 40,
    createdBy: mockOrganizer,
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
  },
  {
    _id: 'mock-meetup',
    title: 'Study Circle & Career Chat',
    description:
      'An evening meetup for assignment help, peer study, and short talks from alumni and industry guests. Pizza after—bring your questions.',
    date: '2026-11-15T00:00:00.000Z',
    time: '2026-11-15T16:00:00.000Z',
    toTime: '2026-11-15T19:00:00.000Z',
    location: 'Student Lounge, Faraba Banta Campus',
    status: 'upcoming',
    ticketingEnabled: false,
    ticketTiers: [],
    imageUrl: '/ITCA_RETREAT/retreat-lunch.jpg',
    capacity: 50,
    createdBy: mockOrganizer,
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
  },
];


const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

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

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'upcoming':
      return { color: 'bg-[#FFE0CC] text-[#0A1628]', text: 'Upcoming' };
    case 'ongoing':
      return { color: 'bg-[#005080] text-white', text: 'Ongoing' };
    case 'completed':
      return { color: 'bg-[#D4E6F2] text-[#0A1628]', text: 'Completed' };
    default:
      return { color: 'bg-white text-[#0A1628]', text: 'Unknown' };
  }
};

const getEnabledTiers = (event: Event) => event.ticketTiers?.filter((t) => t.enabled) ?? [];

const EventCard = ({ event, index }: { event: Event; index: number }) => {
  const [imageError, setImageError] = useState(false);
  const statusConfig = getStatusConfig(event.status);
  const enabledTiers = getEnabledTiers(event);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group overflow-hidden rounded-[2rem] bg-white"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {event.imageUrl && !imageError ? (
          <Image
            fill
            priority
            alt={event.title}
            src={event.imageUrl}
            onError={() => setImageError(true)}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#005080]">
            <Calendar className="h-14 w-14 text-white" />
          </div>
        )}
      </div>

      <div className="px-6 pb-6 pt-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h3 className="text-xl font-bold leading-snug text-[#0A1628]">{event.title}</h3>
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusConfig.color}`}
          >
            {statusConfig.text}
          </span>
        </div>

        <p className="mb-5 line-clamp-2 text-sm text-[#0A1628]/70">{event.description}</p>

        <div className="space-y-2 text-sm text-[#0A1628]/70">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDateRange(event)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{formatTimeRange(event)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          {enabledTiers.length > 0 && (
            <div className="flex items-center gap-2">
              <Ticket className="h-4 w-4" />
              <span>{enabledTiers.map((t) => `${t.label}: D${t.price}`).join(' · ')}</span>
            </div>
          )}
        </div>

        {enabledTiers.length > 0 &&
          (event._id.startsWith('mock-') ? (
            <button type="button" className={`mt-5 w-full ${darkCtaClass}`}>
              <Ticket className="h-4 w-4" />
              {enabledTiers.length === 1
                ? `Buy ${enabledTiers[0].label} — D${enabledTiers[0].price}`
                : 'Buy tickets'}
            </button>
          ) : (
            <Link
              href={
                enabledTiers.length === 1
                  ? `/events/${event._id}/checkout?tier=${enabledTiers[0].type}`
                  : `/events/${event._id}/tickets`
              }
              className={`mt-5 w-full ${darkCtaClass}`}
            >
              <Ticket className="h-4 w-4" />
              {enabledTiers.length === 1
                ? `Buy ${enabledTiers[0].label} — D${enabledTiers[0].price}`
                : 'Buy tickets'}
            </Link>
          ))}
      </div>
    </motion.div>
  );
};

const PAGE_SIZE = 3;

const EventsSection = ({ initialEvents }: { initialEvents?: Event[] }) => {
  const seeded =
    initialEvents && initialEvents.length > 0 ? initialEvents : MOCK_EVENTS;
  const hasInitialData = initialEvents !== undefined;
  const [events, setEvents] = useState<Event[]>(seeded);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(!hasInitialData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hasInitialData) return;

    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get(`${BASE_URL}/events/upcoming?page=1&limit=24`);

        if (response.data.status === 'success') {
          const data = response.data.data as Event[];
          setEvents(data.length > 0 ? data : MOCK_EVENTS);
          setVisibleCount(PAGE_SIZE);
        } else {
          throw new Error('Failed to fetch events');
        }
      } catch {
        setEvents(MOCK_EVENTS);
        setVisibleCount(PAGE_SIZE);
        setError(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [hasInitialData]);

  const visibleEvents = events.slice(0, visibleCount);
  const hasMore = visibleCount < events.length;

  const loadMore = () => {
    setVisibleCount((count) => Math.min(count + PAGE_SIZE, events.length));
  };

  return (
    <section id="events" className="bg-[#0A1628] px-4 py-20 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1400px]">
        <motion.div
          className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="max-w-xl text-4xl font-bold text-white sm:text-5xl">
            What&apos;s happening <span className="text-[#FF6A00]">next</span>
          </h2>
          <p className="landing-mono max-w-md text-sm text-white/70">
            Workshops, sporting events, campus programmes, and other initiatives organised by ITCA
            for School of ICT students.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#FF6A00] border-t-transparent" />
          </div>
        ) : error ? (
          <div className="rounded-[2rem] bg-[#005080] p-10 text-white">
            <h3 className="text-3xl font-bold">Unable to load events</h3>
            <p className="mt-3 max-w-xl">
              We&apos;re having trouble connecting to our events service. Refresh the page or check
              back later.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-full bg-[#0A1628] px-5 py-3 text-sm font-semibold text-[#FF6A00]"
            >
              Try again
            </button>
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-[2rem] bg-[#FFE0CC] p-10 text-[#0A1628]">
            <h3 className="text-3xl font-bold">No upcoming events yet</h3>
            <p className="mt-3 max-w-xl">
              The next workshop, sports day, or campus initiative is being planned. Check back
              soon.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {visibleEvents.map((event, index) => (
                <EventCard key={event._id} event={event} index={index} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={loadMore}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-[#FF6A00] px-8 text-base font-semibold text-white transition hover:brightness-110"
                >
                  Load more
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default EventsSection;
