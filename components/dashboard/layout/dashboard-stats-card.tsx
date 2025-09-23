import { DashboardStatsCardProps } from '@/types/interfaces/dashboard';

const DashboardStatsCard = ({
  title,
  value,
  icon,
  isLoading = false,
  valueClassName = 'text-gray-900',
}: DashboardStatsCardProps) => {
  return (
    <div className="rounded-2xl bg-white/60 p-5 z-1 transition-all hover:-translate-y-2 duration-500">
      <div className="flex justify-between">
        <div>
          <h3 className="text-md font-medium text-gray-500">{title}</h3>

          {isLoading ? (
            <div className="mt-2 h-8 w-20 animate-pulse rounded bg-gray-200"></div>
          ) : (
            <p className={`mt-2 text-2xl font-bold ${valueClassName}`}>{value}</p>
          )}
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default DashboardStatsCard;
