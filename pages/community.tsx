import LandingLayout from '../components/landing-page/landing-layout';
import ApproachSection from '../components/landing-page/approach-section';
import {
  EditorialHero,
  ImmersiveImage,
  FeaturedHeading,
  SpotlightCard,
} from '../components/landing-page/editorial';

const CommunityPage = () => {
  return (
    <LandingLayout
      path="/community"
      title="Community | ITCA Hub"
      description="Learn, play, and belong—workshops, sporting events, retreats, and the School of ICT student community at UTG."
    >
      <EditorialHero
        stats={[
          { value: 'Learn', label: 'Workshops & peer practice' },
          { value: 'Play', label: 'Sports & campus life' },
          { value: 'Belong', label: 'Retreats & real friendships' },
        ]}
      >
        Studying ICT is better when you{' '}
        <span className="underline decoration-2 underline-offset-8">learn</span>,{' '}
        <span className="underline decoration-2 underline-offset-8">play</span>, and{' '}
        <span className="underline decoration-2 underline-offset-8">belong</span> together.
      </EditorialHero>

      <ImmersiveImage
        src="/ITCA_RETREAT/KG__0436.jpg"
        alt="ITCA students sharing a meal at the retreat"
        objectPosition="object-[center_40%]"
      />

      <section className="bg-white px-5 py-20 sm:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-[1400px]">
          <FeaturedHeading>How we show up</FeaturedHeading>
          <SpotlightCard
            image="/ITCA_SPORTS/IMG_8179.jpg"
            imageAlt="ITCA sports on campus"
            kicker="Community life"
            title="Not only labs and lectures—campus that feels alive"
            tone="#D4E6F2"
            ctaHref="#learn-play-belong"
            ctaLabel="See Learn, Play, Belong"
          />
        </div>
      </section>

      <div id="learn-play-belong">
        <ApproachSection />
      </div>
    </LandingLayout>
  );
};

export default CommunityPage;
