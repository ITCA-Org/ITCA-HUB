import axios from 'axios';
import { BASE_URL } from '@/utils/url';
import LandingLayout from '../../components/landing-page/landing-layout';
import EventsSection, { Event, MOCK_EVENTS } from '../../components/landing-page/events-section';
import {
  EditorialMosaic,
  FeaturedHeading,
  SpotlightCard,
  SplitHero,
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
      homeHero
    >
      <SplitHero
        image="/ITCA_WEEK/IMG_4517.jpg"
        alt="ITCA students together at a campus gathering"
        objectPosition="object-[center_30%]"
        tone="#005080"
        lightText
        headline="Campus life moves when we show up."
        body="Bootcamps, sporting events, workshops, and other initiatives organised by ITCA—so School of ICT feels like home."
        ctaHref="#upcoming"
        ctaLabel="See what's coming up"
      />

      <section className="bg-white px-5 py-20 sm:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-[1400px]">
          <FeaturedHeading>Featured moments</FeaturedHeading>
          <SpotlightCard
            image="/ITCA_WEEK/IMG_4248.jpg"
            imageAlt="ITCA Week opening energy"
            kicker="UTG-ITCA Week"
            title="A week that turns classmates into a community"
            tone="#D4E6F2"
            ctaHref="#upcoming"
            ctaLabel="See what's coming up"
          />
        </div>
      </section>

      <section className="w-full bg-white pb-3">
        <EditorialMosaic
          fullBleed
          tiles={[
              {
                type: 'image',
                src: '/ITCA_SPORTS/IMG_8212.jpg',
                alt: 'ITCA sports day',
                className: 'lg:col-span-1 lg:row-span-1',
              },
              {
                type: 'color',
                tone: '#FFE0CC',
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
                tone: '#FF6A00',
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

      <div id="upcoming">
        <EventsSection initialEvents={initialEvents} />
      </div>
    </LandingLayout>
  );
};

export default EventsPage;

export const getServerSideProps = async () => {
  let initialEvents: Event[] = [];

  try {
    const response = await axios.get(`${BASE_URL}/events/upcoming?page=1&limit=24`);
    if (response.data.status === 'success') {
      initialEvents = response.data.data;
    }
  } catch {
    // fall through to mocks
  }

  if (initialEvents.length === 0) {
    initialEvents = MOCK_EVENTS;
  }

  return { props: { initialEvents } };
};
