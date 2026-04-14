const EventCardSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="group relative overflow-hidden rounded-xl border-none bg-white/60"
        >
          {/*==================== Image Skeleton ====================*/}
          <div className="aspect-video w-full bg-linear-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse" />
          {/*==================== End of Image Skeleton ====================*/}

          {/*==================== Content Skeleton ====================*/}
          <div className="p-6">
            {/*==================== Header ====================*/}
            <div className="mb-4 flex items-start justify-between">
              <div className="flex-1">
                {/*==================== Title ====================*/}
                <div className="h-6 bg-linear-to-r from-gray-100 via-gray-200 to-gray-100 rounded mb-2 w-3/4 animate-pulse" />
                {/*==================== End of Title ====================*/}

                {/*==================== Status Badge ====================*/}
                <div className="inline-block h-6 w-20 bg-linear-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full animate-pulse" />
                {/*==================== End of Status Badge ====================*/}
              </div>

              {/*==================== Admin Actions (edit/delete) ====================*/}
              <div className="ml-3 flex space-x-1">
                <div className="h-8 w-8 bg-linear-to-r from-gray-100 via-gray-200 to-gray-100 rounded-md animate-pulse" />
                <div className="h-8 w-8 bg-linear-to-r from-gray-100 via-gray-200 to-gray-100 rounded-md animate-pulse" />
              </div>
              {/*==================== End of Admin Actions (edit/delete) ====================*/}
            </div>

            {/*==================== Description ====================*/}
            <div className="mb-4 space-y-2">
              <div className="h-4 bg-linear-to-r from-gray-100 via-gray-200 to-gray-100 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-linear-to-r from-gray-100 via-gray-200 to-gray-100 rounded animate-pulse" />
            </div>
            {/*==================== End of Description ====================*/}

            {/*==================== Event Details ====================*/}
            <div className="space-y-4 text-sm text-gray-500 mb-4">
              {/*==================== Date ==================== */}
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 bg-linear-to-r from-gray-100 via-gray-200 to-gray-100 rounded animate-pulse" />
                <div className="h-4 w-28 bg-linear-to-r from-gray-100 via-gray-200 to-gray-100 rounded animate-pulse" />
              </div>
              {/*==================== End of Date ==================== */}

              {/*==================== Time ==================== */}
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 bg-linear-to-r from-gray-100 via-gray-200 to-gray-100 rounded animate-pulse" />
                <div className="h-4 w-24 bg-linear-to-r from-gray-100 via-gray-200 to-gray-100 rounded animate-pulse" />
              </div>
              {/*==================== End of Time ==================== */}

              {/*==================== Location ==================== */}
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 bg-linear-to-r from-gray-100 via-gray-200 to-gray-100 rounded animate-pulse" />
                <div className="h-4 w-36 bg-linear-to-r from-gray-100 via-gray-200 to-gray-100 rounded animate-pulse" />
              </div>
              {/*==================== End of Location ==================== */}

              {/*==================== Capacity ==================== */}
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 bg-linear-to-r from-gray-100 via-gray-200 to-gray-100 rounded animate-pulse" />
                <div className="h-4 w-24 bg-linear-to-r from-gray-100 via-gray-200 to-gray-100 rounded animate-pulse" />
              </div>
            </div>
            {/*==================== End of Capacity ==================== */}

            {/*==================== Registration Section ====================*/}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="h-10 w-full bg-linear-to-r from-gray-100 via-gray-200 to-gray-100 rounded-lg animate-pulse" />
            </div>
            {/*==================== End of Registration Section ====================*/}
          </div>
          {/*==================== End of Content Skeleton ====================*/}
        </div>
      ))}
    </div>
  );
};

export default EventCardSkeleton;
