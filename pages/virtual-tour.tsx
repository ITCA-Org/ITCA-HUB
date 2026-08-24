import LandingLayout from '../components/landing-page/landing-layout';
import VirtualTour from '../components/landing-page/virtual-tour';
import {
  EditorialHero,
  ImmersiveImage,
  FeaturedHeading,
  SpotlightCard,
} from '../components/landing-page/editorial';

const VirtualTourPage = () => {
  return (
    <LandingLayout
      path="/virtual-tour"
      title="Virtual Tour | ITCA Hub"
      description="A look around campus life with ITCA—workshops, sports, retreats, and School of ICT moments at UTG."
    >
      <EditorialHero
        stats={[
          { value: 'Faraba', label: 'Banta Campus' },
          { value: 'ICT', label: 'Where we learn and gather' },
          { value: 'ITCA', label: 'Moments beyond the classroom' },
        ]}
      >
        Before you join the next event,{' '}
        <span className="underline decoration-2 underline-offset-8">see the energy</span> that makes
        campus feel like ours.
      </EditorialHero>

      <ImmersiveImage
        src="/IMG_4410.jpg"
        alt="ITCA students at the University of The Gambia"
        objectPosition="object-[center_35%]"
      />

      <section className="bg-white px-5 py-20 sm:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-[1400px]">
          <FeaturedHeading>Around campus</FeaturedHeading>
          <SpotlightCard
            image="/ITCA_RETREAT/retreat-handshake.jpg"
            imageAlt="ITCA community connection"
            kicker="Virtual tour"
            title="Snapshots of workshops, sports, retreats, and week"
            tone="#D4E6F2"
            ctaHref="#tour"
            ctaLabel="Start the tour"
          />
        </div>
      </section>

      <div id="tour">
        <VirtualTour />
      </div>
    </LandingLayout>
  );
};

export default VirtualTourPage;
