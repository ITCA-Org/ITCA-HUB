import { ResourceFilterSkeletonProps } from '@/types/interfaces/resource';

const ResourceFilterSkeleton = ({ role }: ResourceFilterSkeletonProps) => {
  const filterCount = role === 'admin' ? 4 : 3;

  return (
    <div className="mb-6 bg-white rounded-xl p-4">
      <div className="flex items-center mb-4">
        <div className="h-5 w-5 bg-gray-200 rounded animate-pulse mr-2" />
        <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
      </div>

      <div className="mb-4">
        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-1" />
        <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse" />
      </div>

      <div
        className={`grid grid-cols-1 ${role === 'admin' ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-4`}
      >
        {[...Array(filterCount)].map((_, index) => (
          <div key={index}>
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1" />
            <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceFilterSkeleton;
