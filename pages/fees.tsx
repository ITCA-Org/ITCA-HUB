import LandingLayout from '../components/landing-page/landing-layout';
import FeesSection from '../components/landing-page/fees-section';
import PageHeading from '../components/landing-page/page-heading';

const FeesPage = () => {
  return (
    <LandingLayout
      path="/fees"
      title="Semester Fees | ITCA Hub"
      description="Pay your ITCA semester fee (D50) or the full D400 before graduation. Required to collect your audit form."
      showNewsletter={false}
    >
      <PageHeading
        title="Pay ITCA dues"
        description="Pay D50 for a semester or check your outstanding balance."
      />
      <FeesSection />
    </LandingLayout>
  );
};

export default FeesPage;
