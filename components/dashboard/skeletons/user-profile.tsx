import React from 'react';

const UserProfileSkeleton = () => {
  return (
    <div className="animate-pulse space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/*==================== Profile Info Card ====================*/}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="bg-gray-100 h-6 w-40 rounded"></div>
              <div className="bg-gray-100 h-8 w-24 rounded"></div>
            </div>
            {/*==================== End of Profile Info Card ====================*/}

            {/*==================== Profile Picture & Name ====================*/}
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-48 h-48 rounded-full bg-gray-100"></div>
              <div className="space-y-2">
                <div className="bg-gray-100 h-5 w-32 rounded"></div>
                <div className="bg-gray-100 h-4 w-24 rounded"></div>
              </div>
            </div>
            {/*==================== End of Profile Picture & Name ====================*/}

            {/*==================== Profile Details ====================*/}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((_, i) => (
                <div key={i}>
                  <div className="bg-gray-100 h-4 w-20 mb-1 rounded"></div>
                  <div className="bg-gray-100 h-5 w-32 rounded"></div>
                </div>
              ))}
            </div>
            {/*==================== End of Profile Details ====================*/}
          </div>

          {/*==================== Password & Security Card ====================*/}
          <div className="bg-white rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="bg-gray-100 h-6 w-40 rounded"></div>
              <div className="bg-gray-100 h-8 w-28 rounded"></div>
            </div>
            <div className="space-y-3">
              <div className="bg-gray-100 h-4 w-3/4 rounded"></div>
              <div className="bg-gray-100 h-4 w-1/2 rounded"></div>
            </div>
          </div>
          {/*==================== End of Password & Security Card ====================*/}
        </div>

        {/*==================== Account Summary Card ====================*/}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6">
            <div className="bg-gray-100 h-6 w-32 mb-4 rounded"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i}>
                  <div className="bg-gray-100 h-4 w-20 mb-1 rounded"></div>
                  <div className="bg-gray-100 h-5 w-32 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/*==================== End of Account Summary Card ====================*/}
      </div>
    </div>
  );
};

export default UserProfileSkeleton;
