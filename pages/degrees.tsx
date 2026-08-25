import LandingLayout from '../components/landing-page/landing-layout';
import DegreesSection from '../components/landing-page/degrees-section';
import {
  EditorialHero,
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
      <EditorialHero
        stats={[
          { value: '3', label: 'Undergraduate programmes in the School of ICT' },
          { value: '1', label: 'Shared student association for all of them' },
          { value: 'UTG', label: 'Faraba Banta Campus' },
        ]}
      >
        Different programmes.{' '}
        <span className="underline decoration-2 underline-offset-8">One community</span>. If you
        study ICT at UTG, you&apos;re already{' '}
        <span className="underline decoration-2 underline-offset-8">ITCA</span>.
      </EditorialHero>

      <ImmersiveImage
        src="/ITCA_WEEK/IMG_4374.jpg"
        alt="School of ICT students in a lecture setting"
      />

      <section className="bg-white px-5 py-20 sm:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-[1400px]">
          <FeaturedHeading>In the School of ICT</FeaturedHeading>
          <SpotlightCard
            image="/ITCA_WEEK/IMG_4608.jpg"
            imageAlt="Students learning together"
            kicker="Computer Science"
            title="Build software with intent—and people who get it"
            tone="#FFE0CC"
            ctaHref="#programmes"
            ctaLabel="Browse the programmes"
          />
        </div>
      </section>

      <section className="w-full bg-white pb-3">
        <EditorialMosaic
          fullBleed
          tiles={[
              {
                type: 'color',
                tone: '#D4E6F2',
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

      <div id="programmes">
        <DegreesSection />
      </div>
    </LandingLayout>
  );
};

export default DegreesPage;
