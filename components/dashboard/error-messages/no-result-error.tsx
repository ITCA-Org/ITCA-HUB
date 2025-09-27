import React from 'react';
import { AlertCircle } from 'lucide-react';
import { NoResultsProps } from '@/types/interfaces/error';

const NoResults: React.FC<NoResultsProps> = ({
  filterTerm,
  onClearFilters,
  title = 'No matching resources',
  clearButtonText = 'Clear Filters',
  description = 'Try adjusting your search or filter criteria.',
}) => {
  const finalDescription = filterTerm
    ? `No results found for "${filterTerm}". ${description}`
    : description;

  return (
    <div className="rounded-2xl bg-white p-6 text-center">
      <AlertCircle className="mx-auto h-10 w-10 text-amber-500 mb-3" />
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 mb-4">{finalDescription}</p>
      <div className="flex justify-center">
        <button
          onClick={onClearFilters}
          className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
        >
          {clearButtonText}
        </button>
      </div>
    </div>
  );
};

export default NoResults;
