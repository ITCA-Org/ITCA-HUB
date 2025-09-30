import React from 'react';

type UserTableSkeletonProps = {
  rows?: number;
};

const UserTableSkeleton: React.FC<UserTableSkeletonProps> = ({ rows = 10 }) => {
  return (
    <div className="rounded-2xl bg-white">
      {/*==================== Table Header ====================*/}
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="h-5 w-24 rounded bg-gray-200 animate-pulse" />
          <div className="flex items-center">
            <div className="h-4 w-40 rounded bg-gray-200 animate-pulse" />
            <div className="ml-3 h-8 w-8 rounded-md bg-gray-200 animate-pulse" />
          </div>
        </div>
      </div>
      {/*==================== End of Table Header ====================*/}

      {/*==================== Table ====================*/}
      <div className="overflow-x-auto hide-scrollbar">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[...Array(5)].map((_, i) => (
                <th key={i} className="px-8 py-3 text-left">
                  <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white">
            {[...Array(rows)].map((_, index) => (
              <tr key={index} className="even:bg-gray-100/80">
                {/* User */}
                <td className="whitespace-nowrap px-8 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
                    <div className="ml-4">
                      <div className="h-4 w-32 rounded bg-gray-200 animate-pulse" />
                      <div className="mt-1 h-3 w-40 rounded bg-gray-200 animate-pulse" />
                    </div>
                  </div>
                </td>

                {/* Role */}
                <td className="whitespace-nowrap px-8 py-4">
                  <div className="h-4 w-16 rounded bg-gray-200 animate-pulse" />
                </td>

                {/* Email Status */}
                <td className="whitespace-nowrap px-8 py-4">
                  <div className="h-6 w-24 rounded-md bg-gray-200 animate-pulse" />
                </td>

                {/* Joined */}
                <td className="whitespace-nowrap px-8 py-4">
                  <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
                </td>

                {/* Actions */}
                <td className="whitespace-nowrap px-8 py-4 text-right">
                  <div className="flex items-center space-x-1 justify-end">
                    <div className="h-9 w-9 rounded-full bg-gray-200 animate-pulse" />
                    <div className="h-9 w-9 rounded-full bg-gray-200 animate-pulse" />
                    <div className="h-9 w-9 rounded-full bg-gray-200 animate-pulse" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/*==================== End of Table ====================*/}

      {/*==================== Pagination ====================*/}
      <div className="border-t border-gray-200 px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between">
          {/* Results Info */}
          <div className="h-4 w-64 rounded bg-gray-200 animate-pulse" />

          {/* Controls */}
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-md bg-gray-200 h-9 w-9 animate-pulse" />
            <div className="flex space-x-1">
              <div className="h-8 w-8 rounded-md bg-gray-200 animate-pulse" />
              <div className="h-8 w-8 rounded-md bg-gray-200 animate-pulse" />
              <div className="h-8 w-8 rounded-md bg-gray-200 animate-pulse" />
            </div>
            <div className="p-2 rounded-md bg-gray-200 h-9 w-9 animate-pulse" />
          </div>
        </div>
      </div>
      {/*==================== End of Pagination ====================*/}
    </div>
  );
};

export default UserTableSkeleton;
