import LandingLayout from '../components/landing-page/landing-layout';
import ResourcesSection from '../components/landing-page/resources-section';
import {
  EditorialHero,
  ImmersiveImage,
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

      <div id="library">
        <ResourcesSection />
      </div>
    </LandingLayout>
  );
};

export default ResourcesPage;
