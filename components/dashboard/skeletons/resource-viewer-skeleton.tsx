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

          {role === 'admin' && (
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          )}
        </div>

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

        <div
          className={`grid grid-cols-1 ${
            role === 'admin' ? 'md:grid-cols-5' : 'md:grid-cols-3'
          } gap-4`}
        >
          <div>
            <div className="flex items-center mb-2">
              <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse mr-3" />
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
          </div>

          <div>
            <div className="flex items-center mb-2">
              <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse mr-3" />
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-5 w-28 bg-gray-200 rounded animate-pulse" />
          </div>

          {role === 'student' && (
            <div>
              <div className="flex items-center mb-2">
                <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse mr-3" />
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
          )}

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

      <div className="bg-white rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200">
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="overflow-x-auto hide-scrollbar">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-normal uppercase tracking-wider text-gray-400">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal uppercase tracking-wider text-gray-400">
                  <div className="h-4 w-14 bg-gray-200 rounded animate-pulse" />
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal uppercase tracking-wider text-gray-400 w-32">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                </th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {[...Array(4)].map((_, index) => (
                <tr
                  key={index}
                  className="even:bg-gray-100/80 hover:bg-amber-100 border-none transition-colors cursor-pointer"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
                      <div className="ml-2 max-w-[250px]">
                        <div className="h-4 w-44 bg-gray-200 rounded animate-pulse mb-2" />
                        <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 max-w-[250px]">
                    <div className="inline-flex items-center px-1.5 py-0.5">
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
                      {role === 'admin' && (
                        <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ResourceViewerSkeleton;
