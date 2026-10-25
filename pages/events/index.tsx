import PageHeading from '../../components/landing-page/page-heading';
import axios from 'axios';
import Link from 'next/link';
import { BASE_URL } from '@/utils/url';
import LandingLayout from '../../components/landing-page/landing-layout';
import EventsSection, { Event } from '../../components/landing-page/events-section';
import {
  EditorialMosaic,
  FeaturedHeading,
  SpotlightCard,
} from '../../components/landing-page/editorial';

type EventsPageProps = {
  initialEvents: Event[];
};

const EventsPage = ({ initialEvents }: EventsPageProps) => {
  return (
    <LandingLayout
      path="/events"
      title="Events | ITCA Hub"
      description="Upcoming workshops, sporting events, and campus initiatives organised by ITCA for School of ICT students."
      showNewsletter={false}
    >
      <PageHeading
        title="ITCA events"
        description="Find upcoming workshops, sports and campus activities. Open an event for details and tickets."
      />
      <div id="upcoming">
        <EventsSection initialEvents={initialEvents} compact />
      </div>
      <section className="bg-white itca-white-surface px-5 py-20 sm:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-[1400px]">
          <Link
            href="/hackathon"
            className="mb-12 block rounded-2xl bg-[#005080] itca-blue-surface p-8 text-white"
          >
            <p className="text-[var(--itca-accent-ink)]">Past event · 21 October 2026</p>
            <h2 className="mt-3 text-3xl font-bold">ITCA Hackathon &amp; Seminar</h2>
            <p className="mt-3">See the event details and highlights →</p>
          </Link>
          <FeaturedHeading>Featured moments</FeaturedHeading>
          <SpotlightCard
            image="/ITCA_WEEK/IMG_4248.jpg"
            imageAlt="ITCA Week opening energy"
            kicker="UTG-ITCA Week"
            title="A week that turns classmates into a community"
            tone="#FFFFFF"
            ctaHref="#upcoming"
            ctaLabel="See what's coming up"
          />
        </div>
      </section>

      <section className="w-full bg-white itca-white-surface pb-3">
        <EditorialMosaic
          fullBleed
          tiles={[
            {
              type: 'image',
              src: '/ITCA_WEEK/IMG_4517.jpg',
              alt: 'ITCA students together at a campus gathering',
            },
            {
              type: 'image',
              src: '/ITCA_SPORTS/IMG_8212.jpg',
              alt: 'ITCA sports day',
              className: 'lg:col-span-1 lg:row-span-1',
            },
            {
              type: 'color',
              tone: '#FFFFFF',
              kicker: 'Sporting events',
              title: 'Play hard. Meet people. Balance the semester.',
            },
            {
              type: 'image',
              src: '/ITCA_RETREAT/retreat-gathering.jpg',
              alt: 'ITCA retreat',
              className: 'sm:col-span-2 lg:col-span-1',
            },
            {
              type: 'color',
              tone: '#005080',
              kicker: 'Bootcamps',
              title: 'Hands-on sessions that stick beyond the lecture hall.',
              className: 'sm:col-span-2 lg:col-span-2',
              lightText: true,
            },
            {
              type: 'image',
              src: '/ITCA_WEEK/IMG_4237.jpg',
              alt: 'ITCA workshop energy',
            },
          ]}
        />
      </section>
    </LandingLayout>
  );
};

export default EventsPage;

export const getServerSideProps = async () => {
  let initialEvents: Event[] = [];

  try {
    const response = await axios.get(`${BASE_URL}/events/upcoming?page=1&limit=24`, {
      timeout: 8000,
    });
    if (response.data.status === 'success') {
      initialEvents = response.data.data;
    }
  } catch {
    // Pass empty list; EventsSection shows empty/error UI from client if needed.
  }

  return { props: { initialEvents } };
};
