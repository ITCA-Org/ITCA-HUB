import PageHeading from '../components/landing-page/page-heading';
import LandingLayout from '../components/landing-page/landing-layout';
import DegreesSection from '../components/landing-page/degrees-section';
import {
  EditorialMosaic,
  FeaturedHeading,
  ImmersiveImage,
  SpotlightCard,
} from '../components/landing-page/editorial';

const DegreesPage = () => {
  return (
    <LandingLayout
      path="/degrees"
      title="Degrees | ITCA Hub"
      description="Computer Science, Information Systems, and Telecommunications—the School of ICT programmes that make up the ITCA community."
    >
      <PageHeading
        title="School of ICT programmes"
        description="Explore Computer Science, Information Systems and Telecommunications."
      />
      <div id="programmes">
        <DegreesSection compact />
      </div>
      <ImmersiveImage
        src="/ITCA_WEEK/IMG_4374.jpg"
        alt="School of ICT students in a lecture setting"
      />

      <section className="bg-white itca-white-surface px-5 py-20 sm:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-[1400px]">
          <FeaturedHeading>In the School of ICT</FeaturedHeading>
          <SpotlightCard
            image="/ITCA_WEEK/IMG_4608.jpg"
            imageAlt="Students learning together"
            kicker="Computer Science"
            title="Build software with intent—and people who get it"
            tone="#FFFFFF"
            ctaHref="#programmes"
            ctaLabel="Browse the programmes"
          />
        </div>
      </section>

      <section className="w-full bg-white itca-white-surface pb-3">
        <EditorialMosaic
          fullBleed
          tiles={[
            {
              type: 'color',
              tone: '#FFFFFF',
              kicker: 'Information Systems',
              title: 'Bridge people, process, and technology.',
            },
            {
              type: 'image',
              src: '/ITCA_WEEK/IMG_4094.jpg',
              alt: 'Students collaborating',
            },
            {
              type: 'color',
              tone: '#005080',
              kicker: 'Telecommunications',
              title: 'Keep communities connected.',
              lightText: true,
            },
          ]}
        />
      </section>
    </LandingLayout>
  );
};

export default DegreesPage;
