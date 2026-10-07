import { DashboardStatsCardProps } from '@/types/interfaces/dashboard';
const DashboardStatsCard = ({
  icon,
  title,
  value,
  isLoading = false,
  valueClassName = 'text-[#0A1628]',
}: DashboardStatsCardProps) => (
  <div className="rounded-2xl border border-[#0A1628]/10 bg-white p-6">
    <div className="mb-6 flex items-center justify-between gap-3">
      <h3 className="text-sm font-medium text-[#0A1628]/60">{title}</h3>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D4E6F2]/60 text-[#005080] [&_svg]:text-current">
        {icon}
      </div>
    </div>
    {isLoading ? (
      <div
        role="status"
        aria-label={`Loading ${title}`}
        className="h-11 w-24 animate-pulse rounded bg-[#D4E6F2]"
      />
    ) : (
      <p className={`text-4xl font-semibold tracking-tight ${valueClassName}`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
    )}
  </div>
);
export default DashboardStatsCard;
