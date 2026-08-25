import LandingLayout from '../components/landing-page/landing-layout';
import FeesSection from '../components/landing-page/fees-section';
import { FEE_TOTAL_REQUIRED, formatFeeAmount } from '@/utils/fees';

const FeesPage = () => {
  return (
    <LandingLayout
      path="/fees"
      title="Semester Fees | ITCA Hub"
      description="Pay your ITCA semester fee (D50) or the full D400 before graduation. Required to collect your audit form."
      showFloatingCta={false}
    >
      <div className="bg-white px-4 pb-2 pt-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <p className="landing-mono text-xs text-[#FF6A00] sm:text-sm">Semester fees</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-[#0A1628] sm:mt-4 sm:text-5xl lg:text-6xl">
            Clear your ITCA dues.{' '}
            <span className="underline decoration-2 underline-offset-8">D50</span> a semester, or{' '}
            <span className="underline decoration-2 underline-offset-8">
              {formatFeeAmount(FEE_TOTAL_REQUIRED)}
            </span>{' '}
            in full—before you graduate.
          </h1>
        </div>
      </div>

      <FeesSection />
    </LandingLayout>
  );
};

export default FeesPage;
