import LandingLayout from '../components/landing-page/landing-layout';
import ResourcesSection from '../components/landing-page/resources-section';
import PageHeading from '../components/landing-page/page-heading';
import { ImmersiveImage } from '../components/landing-page/editorial';

export default function ResourcesPage() {
  return (
    <LandingLayout
      path="/resources"
      title="Resources | ITCA Hub"
      description="Past papers, course outlines and free developer tools for School of ICT students."
      showNewsletter={false}
    >
      <PageHeading
        title="Study resources"
        description="Choose past papers, course outlines or the student developer tools guide."
      />
      <div id="library">
        <ResourcesSection showHeading={false} />
      </div>
      <ImmersiveImage src="/ITCA_WEEK/IMG_4608.jpg" alt="Students studying and collaborating" />
    </LandingLayout>
  );
}
