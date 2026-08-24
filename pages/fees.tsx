import LandingLayout from '../components/landing-page/landing-layout';
import FeesSection from '../components/landing-page/fees-section';
import { EditorialHero } from '../components/landing-page/editorial';
import { FEE_TOTAL_REQUIRED, formatFeeAmount } from '@/utils/fees';

const FeesPage = () => {
  return (
    <LandingLayout
      path="/fees"
      title="Semester Fees | ITCA Hub"
      description="Pay your ITCA semester fee (D50) or the full D400 before graduation. Required to collect your audit form."
    >
      <div className="hidden md:block">
        <EditorialHero
          stats={[
            { value: 'D50', label: 'Per semester installment' },
            { value: 'D400', label: 'Total due before graduation' },
            { value: 'Audit', label: 'Form only if dues are cleared' },
          ]}
        >
          Clear your ITCA dues.{' '}
          <span className="underline decoration-2 underline-offset-8">D50</span> a semester, or{' '}
          <span className="underline decoration-2 underline-offset-8">
            {formatFeeAmount(FEE_TOTAL_REQUIRED)}
          </span>{' '}
          in full—before you graduate.
        </EditorialHero>
      </div>

      <div className="bg-white px-4 pb-2 pt-24 md:hidden">
        <p className="landing-mono text-xs text-[#FF6A00]">Semester fees</p>
        <h1 className="mt-2 text-2xl font-bold leading-tight text-[#0A1628] sm:text-3xl">
          Pay D50 or D400
        </h1>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-[#0A1628]/70">
          Total {formatFeeAmount(FEE_TOTAL_REQUIRED)} before graduation to collect your audit form.
        </p>
      </div>

      <FeesSection />
    </LandingLayout>
  );
};

export default FeesPage;
