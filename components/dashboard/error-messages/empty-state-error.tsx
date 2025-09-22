import React from 'react';
import Link from 'next/link';
import { FileText, Upload, RefreshCw } from 'lucide-react';
import { EmptyStateProps } from '@/types/interfaces/error';

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  uploadUrl,
  onRefresh,
  description,
  uploadButtonText,
  itemName = 'resource',
  showUploadButton = true,
  showRefreshButton = true,
  uploadIcon: UploadIcon = Upload,
}) => {
  const defaultTitle = `No ${itemName}s found`;
  const defaultDescription = `Get started by uploading your first ${itemName} to the library.`;
  const defaultUploadButtonText = `Upload ${itemName.charAt(0).toUpperCase() + itemName.slice(1)}`;

  return (
    <div className="rounded-2xl bg-white p-8 text-center">
      <FileText className="mx-auto h-12 w-12 bg-blue-100/70 p-2 rounded-full text-blue-700 mb-3" />
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title || defaultTitle}</h3>
      <p className="text-gray-500 mb-4">{description || defaultDescription}</p>
      <div className="flex justify-center space-x-4">
        {showRefreshButton && onRefresh && (
          <button
            onClick={onRefresh}
            className="inline-flex items-center rounded-lg border-none bg-gray-200/60 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </button>
        )}

        {showUploadButton && uploadUrl && (
          <Link
            href={uploadUrl}
            className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-700 to-blue-600 px-4 py-2 text-sm font-medium text-white hover:from-blue-800 hover:to-blue-700 focus:outline-none focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <UploadIcon className="mr-2 h-4 w-4" />
            {uploadButtonText || defaultUploadButtonText}
          </Link>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
