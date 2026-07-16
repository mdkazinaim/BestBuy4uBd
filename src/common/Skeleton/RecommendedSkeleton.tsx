const RecommendedSkeleton = () => {
  return (
    <div className="container mx-auto px-4 flex flex-col gap-20 animate-pulse">
      {Array.from({ length: 2 }).map((_, idx) => (
        <div key={idx} className="flex flex-col">
          {/* Header */}
          <div className="flex justify-center mb-10">
            <div className="h-8 w-48 bg-bg-surface rounded-component" />
          </div>

          {/* Carousel Layout */}
          <div className="flex items-center gap-4">
            {/* Left Control Skeleton */}
            <div className="hidden md:flex flex-col items-center gap-4 bg-bg-surface p-2 rounded-component border border-border-main w-12 h-40 shrink-0" />

            {/* Product Grid Skeleton (6 items) */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-bg-surface rounded-component p-4 border border-border-main shadow-sm h-[380px] flex flex-col justify-between"
                >
                  <div>
                    <div className="w-full h-48 bg-bg-base rounded-inner mb-4" />
                    <div className="h-4 w-3/4 bg-bg-base rounded mb-2" />
                    <div className="h-4 w-1/2 bg-bg-base rounded mb-4" />
                  </div>
                  <div className="flex justify-between mt-auto">
                    <div className="h-6 w-20 bg-bg-base rounded" />
                    <div className="h-8 w-8 bg-bg-base rounded-full" />
                  </div>
                </div>
              ))}
            </div>

            {/* Right Control Skeleton */}
            <div className="hidden md:flex flex-col items-center gap-4 bg-bg-surface p-2 rounded-component border border-border-main w-12 h-40 shrink-0" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecommendedSkeleton;
