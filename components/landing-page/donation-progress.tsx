import { formatDalasi } from '@/components/landing-page/shop-data';
import { campaignProgress, DonationCampaign } from '@/hooks/donations/use-donations';

type DonationProgressProps = {
  campaign: Pick<DonationCampaign, 'goalAmount' | 'raisedAmount' | 'donorCount'>;
};

const DonationProgress = ({ campaign }: DonationProgressProps) => {
  const percent = campaignProgress(campaign);

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-2xl font-bold text-[#0A1628]">{formatDalasi(campaign.raisedAmount)}</p>
        {campaign.goalAmount > 0 && (
          <p className="text-sm text-[#0A1628]/60">of {formatDalasi(campaign.goalAmount)}</p>
        )}
      </div>
      {campaign.goalAmount > 0 && (
        <div
          className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-[#0A1628]/10"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="h-full rounded-full bg-[#FF6A00]" style={{ width: `${percent}%` }} />
        </div>
      )}
      <p className="mt-2 text-sm text-[#0A1628]/60">
        {campaign.donorCount.toLocaleString()}{' '}
        {campaign.donorCount === 1 ? 'donation' : 'donations'}
        {campaign.goalAmount > 0 && ` · ${percent}% funded`}
      </p>
    </div>
  );
};

export default DonationProgress;
