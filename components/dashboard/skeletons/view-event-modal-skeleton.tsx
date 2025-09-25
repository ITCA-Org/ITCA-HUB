import React from 'react';

const ViewEventModalSkeleton = () => {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto relative hide-scrollbar">
        <div>
          {/*==================== Header Skeleton ====================*/}
          <div className="flex items-center justify-between w-full mb-6">
            <div className="h-8 bg-gray-200 rounded-lg w-2/3 animate-pulse"></div>
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
          </div>
          {/*==================== End of Header Skeleton ====================*/}

          {/*==================== Image Skeleton ====================*/}
          <div className="mb-6">
            <div className="rounded-lg overflow-hidden bg-gray-200 w-full h-64 animate-pulse"></div>
          </div>
          {/*==================== End of Image Skeleton ====================*/}

          {/*==================== Description Skeleton ====================*/}
          <div className="mb-6">
            <div className="h-6 bg-gray-200 rounded w-32 mb-3 animate-pulse"></div>
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>
            </div>
          </div>
          {/*==================== End of Description Skeleton ====================*/}

          {/*==================== Metadata Skeleton ====================*/}
          <div className="grid grid-cols-1 mb-6 border-t border-b">
            <div className="rounded-lg p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <div className="h-4 bg-gray-200 rounded w-20 mb-1 animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-1 animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>
            </div>

            <div className="rounded-lg p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <div className="h-4 bg-gray-200 rounded w-20 mb-1 animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded w-40 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-36 mt-1 animate-pulse"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-28 mb-1 animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded w-40 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-36 mt-1 animate-pulse"></div>
              </div>
            </div>
          </div>
          {/*==================== End of Metadata Skeleton ====================*/}

          {/*==================== Attendees Skeleton ====================*/}
          <div className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-3">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-white p-3 rounded-lg">
                    <div className="bg-gray-200 p-2 rounded-full w-8 h-8 animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-32 mb-1 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-40 animate-pulse"></div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-8 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/*==================== End of Attendees Skeleton ====================*/}
        </div>
      </div>
    </div>
  );
};

export default ViewEventModalSkeleton;
