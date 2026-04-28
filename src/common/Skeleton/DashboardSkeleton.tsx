

const DashboardSkeleton = () => {
  return (
    <div className="space-y-8 p-1 animate-pulse">
      {/* Header Skeleton */}
      <div className="h-32 bg-gray-200 rounded-2xl w-full" />

      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-28 bg-gray-200 rounded-2xl" />
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-[400px] bg-gray-200 rounded-2xl" />
        <div className="h-[400px] bg-gray-200 rounded-2xl" />
      </div>

      {/* Recent Orders & Breakdown Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 h-[400px] bg-gray-200 rounded-2xl" />
        <div className="h-[400px] bg-gray-200 rounded-2xl" />
      </div>
    </div>
  );
};

export default DashboardSkeleton;
