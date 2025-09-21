const ResourceViewerSkeleton = () => {
  return (
    <>
      {/*==================== Header Skeleton ====================*/}
      <div className="mb-8">
        <div className="flex items-center">
          <div className="mr-3 h-8 w-8 bg-gray-200 rounded-lg animate-pulse" />
          <div>
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
      {/*==================== End of Header Skeleton ====================*/}

      {/*==================== Resource Information Card Skeleton ====================*/}
      <div className="bg-white rounded-2xl p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
          <div className="flex-1 mb-4 lg:mb-0">
            <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse mb-3" />
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>

        {/*==================== Stats Grid Skeleton ====================*/}
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
        {/*==================== End of Stats Grid Skeleton ====================*/}

        {/*==================== Details Grid Skeleton ====================*/}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index}>
              <div className="flex items-center mb-2">
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse mr-2" />
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
        {/*==================== End of Details Grid Skeleton ====================*/}
      </div>
      {/*==================== End of Resource Information Card Skeleton ====================*/}

      {/*==================== Files Table Skeleton ====================*/}
      <div className="bg-white rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="h-5 w-5 bg-gray-200 rounded animate-pulse mr-2" />
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="h-3 w-12 bg-gray-200 rounded animate-pulse" />
                </th>
                <th className="px-6 py-3 text-right">
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse ml-auto" />
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...Array(3)].map((_, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-5 w-5 bg-gray-200 rounded animate-pulse mr-3" />
                      <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <div className="h-7 w-20 bg-gray-200 rounded-lg animate-pulse" />
                      <div className="h-7 w-16 bg-gray-200 rounded-lg animate-pulse" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/*==================== End of Files Table Skeleton ====================*/}
    </>
  );
};

export default ResourceViewerSkeleton;
