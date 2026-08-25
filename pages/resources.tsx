import LandingLayout from '../components/landing-page/landing-layout';
import ResourcesSection from '../components/landing-page/resources-section';
import {
  EditorialHero,
  ImmersiveImage,
  FeaturedHeading,
  SpotlightCard,
  EditorialMosaic,
} from '../components/landing-page/editorial';

const ResourcesPage = () => {
  return (
    <LandingLayout
      path="/resources"
      title="Resources | ITCA Hub"
      description="Shared notes, tools, and practice materials for School of ICT students in the ITCA community."
    >
      <EditorialHero
        stats={[
          { value: '120+', label: 'Guides & e-books' },
          { value: '85+', label: 'Lecture notes shared' },
          { value: 'ICT', label: 'Built for our school' },
        ]}
      >
        The semester is heavy enough. We share what helps you{' '}
        <span className="underline decoration-2 underline-offset-8">keep going</span>.
      </EditorialHero>

      <ImmersiveImage
        src="/ITCA_WEEK/IMG_4608.jpg"
        alt="Students studying and collaborating"
      />

      <section className="bg-white px-5 py-20 sm:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-[1400px]">
          <FeaturedHeading>What we put together</FeaturedHeading>
          <SpotlightCard
            image="/ITCA_WEEK/IMG_4094.jpg"
            imageAlt="ITCA students with laptops"
            kicker="For members"
            title="Notes, tools, and practice—so nobody starts from zero"
            tone="#FFE0CC"
            ctaHref="#library"
            ctaLabel="Browse resources"
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
                kicker: 'Peer learning',
                title: 'Pass notes forward. Lift the next cohort.',
              },
              {
                type: 'image',
                src: '/ITCA_RETREAT/retreat-lunch.jpg',
                alt: 'Students together',
              },
              {
                type: 'color',
                tone: '#005080',
                kicker: 'Always growing',
                title: 'More materials each semester.',
                lightText: true,
              },
            ]}
        />
      </section>

      <div id="library">
        <ResourcesSection />
      </div>
    </LandingLayout>
  );
};

export default ResourcesPage;
