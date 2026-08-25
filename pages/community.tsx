import LandingLayout from '../components/landing-page/landing-layout';
import ApproachSection from '../components/landing-page/approach-section';
import {
  FeaturedHeading,
  SpotlightCard,
  SplitHero,
} from '../components/landing-page/editorial';

const CommunityPage = () => {
  return (
    <LandingLayout
      path="/community"
      title="Community | ITCA Hub"
      description="Learn, play, and belong—workshops, sporting events, retreats, and the School of ICT student community at UTG."
      homeHero
    >
      <SplitHero
        image="/ITCA_RETREAT/KG__0436.jpg"
        alt="ITCA students sharing a meal at the retreat"
        objectPosition="object-[center_40%]"
        tone="#FF6A00"
        headline="Where School of ICT students learn, play, and belong."
        body="ITCA is the shared home beyond the lecture hall—bootcamps, sports days, retreats, and friendships that make campus feel like ours."
        ctaHref="#learn-play-belong"
        ctaLabel="See Learn, Play, Belong"
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
