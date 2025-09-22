import { DashboardPageHeaderProps } from '@/types/interfaces/dashboard';

const DashboardPageHeader = ({
  title,
  subtitle,
  description,
  showPulse = true,
  actions,
  leftActions,
  titleColors = {
    primary: 'text-blue-700',
    secondary: 'text-amber-500',
  },
}: DashboardPageHeaderProps) => {
  const renderTitle = () => {
    if (subtitle) {
      return (
        <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <span className={`${titleColors.primary} mr-2`}>{title}</span>
          <span className={titleColors.secondary}>{subtitle}</span>
          {showPulse && (
            <span className="ml-3 relative">
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
            </span>
          )}
        </h1>
      );
    }

    return (
      <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
        <span className={titleColors.primary}>{title}</span>
        {showPulse && (
          <span className="ml-3 relative">
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
          </span>
        )}
      </h1>
    );
  };

  return (
    <div className="mb-8 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-4">
        {/*==================== Left Actions ====================*/}
        {leftActions && (
          <div className="flex-shrink-0 flex items-start bg-white rounded-full p-3">
            {leftActions}
          </div>
        )}
        {/*==================== End of Left Actions ====================*/}

        {/*==================== Title and Description ====================*/}
        <div className="flex-1">
          {renderTitle()}
          {description && <p className="text-gray-600">{description}</p>}
        </div>
        {/*==================== End of Title and Description ====================*/}

        {/*==================== Right Actions ====================*/}
        {actions && <div className="flex-shrink-0 mt-4 sm:mt-0 flex space-x-3">{actions}</div>}
        {/*==================== End of Right Actions ====================*/}
      </div>
    </div>
  );
};

export default DashboardPageHeader;
