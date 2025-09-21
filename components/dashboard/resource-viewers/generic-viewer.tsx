import React from 'react';
import { FileText} from 'lucide-react';

interface GenericViewerProps {
  fileUrl: string;
  title: string;
  fileType?: string;
  resourceId?: string;
  token?: string;
}

const GenericViewer: React.FC<GenericViewerProps> = ({
  title,
  fileType = 'unknown',
  resourceId,
}) => {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex-1 bg-gray-50 rounded-b-lg p-8 flex flex-col items-center justify-center">
        <FileText className="h-16 w-16 text-gray-400 mb-4" />
        <h4 className="text-xl font-medium text-gray-700 mb-2">{title}</h4>
        <p className="text-gray-500 mb-6 text-center">
          This file type ({fileType.toUpperCase()}) cannot be previewed directly.
          <br />
          You can download it or open it in a new tab to view the content.
        </p>

        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200 w-full max-w-md">
          <h5 className="text-sm font-medium text-gray-900 mb-2">File Information</h5>
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Type:</span>
              <span className="font-medium">{fileType.toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span>Name:</span>
              <span className="font-medium truncate ml-2">{title}</span>
            </div>
            {resourceId && (
              <div className="flex justify-between">
                <span>Resource ID:</span>
                <span className="font-medium font-mono text-xs">{resourceId.slice(-8)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenericViewer;
