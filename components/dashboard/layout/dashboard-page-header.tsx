import { DashboardPageHeaderProps } from '@/types/interfaces/dashboard';
const DashboardPageHeader = ({
  title,
  subtitle,
  actions,
  description,
  leftActions,
}: DashboardPageHeaderProps) => (
  <div className="mb-8 flex w-full flex-col justify-between gap-5 border-b border-[#0A1628]/10 pb-7 sm:flex-row sm:items-end">
    <div className="flex min-w-0 items-center gap-4">
      {leftActions && (
        <div className="shrink-0 rounded-full border border-[#0A1628]/10 bg-white p-3">
          {leftActions}
        </div>
      )}
      <div>
        <p className="landing-mono mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-[#005080]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FF6A00]" />
          ITCA / Administration
        </p>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-[#0A1628] lg:text-4xl">
          {title}
          {subtitle && (
            <>
              {' '}
              <span className="landing-serif font-normal italic text-[#005080]">{subtitle}</span>
            </>
          )}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#0A1628]/60">{description}</p>
        )}
      </div>
    </div>
    {actions && <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div>}
  </div>
);
export default DashboardPageHeader;
