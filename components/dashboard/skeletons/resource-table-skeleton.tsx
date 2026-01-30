const ResourceTableSkeleton = () => {
  return (
    <>
      {/*==================== Table Skeleton ====================*/}
      <div className="rounded-2xl bg-white">
        <div className="px-5 py-4 border-b border-gray-200">
          <div className="h-6 w-1/4 rounded bg-gray-200 animate-pulse"></div>
        </div>
        <div className="overflow-x-auto hide-scrollbar">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Resource', 'Department', 'Type', 'Size', 'Usage', 'Status', 'Actions'].map(
                  (header) => (
                    <th
                      scope="col"
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      <div className="h-4 w-36 rounded bg-gray-200 animate-pulse"></div>
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="bg-white">
              {[...Array(10)].map((_, index) => (
                <tr key={index} className="even:bg-gray-100/80">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="shrink-0 h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                      <div className="ml-4">
                        <div className="h-4 w-36 rounded bg-gray-200 animate-pulse"></div>
                        <div className="mt-1 h-3 w-24 rounded bg-gray-200 animate-pulse"></div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="h-5 w-20 rounded-full bg-gray-200 animate-pulse"></div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="h-4 w-12 rounded bg-gray-200 animate-pulse"></div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="h-4 w-16 rounded bg-gray-200 animate-pulse"></div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 rounded bg-gray-200 animate-pulse"></div>
                      <div className="h-4 w-8 rounded bg-gray-200 animate-pulse"></div>
                      <div className="h-4 w-1 rounded bg-gray-200 animate-pulse"></div>
                      <div className="h-4 w-4 rounded bg-gray-200 animate-pulse"></div>
                      <div className="h-4 w-8 rounded bg-gray-200 animate-pulse"></div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="h-5 w-16 rounded-full bg-gray-200 animate-pulse"></div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex space-x-2 justify-end">
                      <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                      <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                      <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                      <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                      <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/*==================== End of Table Skeleton ====================*/}
    </>
  );
};

export default ResourceTableSkeleton;
