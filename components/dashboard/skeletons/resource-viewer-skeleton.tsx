import { ResourceFilterSkeletonProps } from '@/types/interfaces/resource';

const ResourceViewerSkeleton = ({ role }: ResourceFilterSkeletonProps) => {
  return (
    <>
      <div className="bg-white rounded-2xl p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
          <div className="flex-1 mb-4 lg:mb-0">
            <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse mb-3" />
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
          </div>
          {/* Action Button (Admin Only) */}
          {role === 'admin' && (
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          )}
        </div>

        {/*==================== Stats Grid Skeleton (Admin Only) ====================*/}
        {role === 'admin' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse mr-2" />
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-8 w-12 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        )}

        {/*==================== Role-Specific Details Grid Skeleton ====================*/}
        <div
          className={`grid grid-cols-1 ${role === 'admin' ? 'md:grid-cols-5' : 'md:grid-cols-3'} gap-4`}
        >
          {/* Department */}
          <div>
            <div className="flex items-center mb-2">
              <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse mr-3" />
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Academic Level */}
          <div>
            <div className="flex items-center mb-2">
              <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse mr-3" />
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-5 w-28 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Student-Only: Category */}
          {role === 'student' && (
            <div>
              <div className="flex items-center mb-2">
                <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse mr-3" />
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
          )}

          {/* Admin-Only Fields */}
          {role === 'admin' && (
            <>
              <div>
                <div className="flex items-center mb-2">
                  <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse mr-3" />
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse mr-3" />
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse mr-3" />
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Files Table Skeleton */}
      <div className="bg-white rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-gray-200 rounded animate-pulse mr-4" />
                  <div>
                    <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ResourceViewerSkeleton;
