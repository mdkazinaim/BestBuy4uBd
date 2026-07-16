import React from "react";

const NewArrivalSkeleton: React.FC = () => {
  return (
    <section className="bg-white dark:bg-slate-950 transition-colors animate-pulse">
      <div className="container mx-auto px-4 space-y-10!">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="h-8 w-48 bg-gray-200 dark:bg-slate-800 rounded" />
          <div className="hidden md:block h-4 w-20 bg-gray-200 dark:bg-slate-800 rounded" />
        </div>

        {/* Pattern Grid: Repeating rows of 1 Large + 3 Small */}
        <div className="flex flex-col gap-6">
          {[0, 1].map((rowIdx) => (
            <div
              key={rowIdx}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Large Card Skeleton (Featured) */}
              <div className="lg:col-span-5">
                <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden h-full flex flex-col justify-between">
                  <div className="flex flex-row p-6 gap-6">
                    {/* Left: Image Skeleton */}
                    <div className="relative w-36 h-44 bg-gray-100 dark:bg-slate-800/50 rounded-xl shrink-0" />

                    {/* Right: Details Skeleton */}
                    <div className="flex flex-col flex-1 py-1 justify-between">
                      <div>
                        {/* Title lines */}
                        <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded mb-2 w-11/12" />
                        <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded mb-4 w-2/3" />
                        {/* Rating */}
                        <div className="h-3 bg-gray-200 dark:bg-slate-800 rounded mb-6 w-1/3" />
                      </div>

                      <div>
                        {/* Price */}
                        <div className="h-6 bg-gray-200 dark:bg-slate-800 rounded mb-4 w-1/2" />
                        {/* Purchases / Heart */}
                        <div className="flex justify-between items-center mb-3">
                          <div className="h-3 bg-gray-200 dark:bg-slate-800 rounded w-1/4" />
                          <div className="h-4 w-4 bg-gray-200 dark:bg-slate-800 rounded-full" />
                        </div>
                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <div className="w-10 h-10 bg-gray-200 dark:bg-slate-800 rounded" />
                          <div className="flex-1 h-10 bg-gray-200 dark:bg-slate-800 rounded" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom: Promotion Box Skeleton */}
                  <div className="px-6 pb-6 mt-auto">
                    <div className="border-t border-gray-100 dark:border-slate-800 pt-6">
                      <div className="bg-gray-50 dark:bg-slate-800/30 rounded-xl p-5 h-24" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Small Cards Grid Skeleton */}
              <div className="lg:col-span-7">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 h-full">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col h-full p-5 border border-gray-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 justify-between"
                    >
                      <div className="flex flex-col items-center">
                        {/* Image */}
                        <div className="aspect-square bg-gray-100 dark:bg-slate-800/50 rounded-lg w-full mb-4" />
                        {/* Title */}
                        <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded mb-2 w-full" />
                        <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded mb-4 w-3/4" />
                      </div>

                      <div>
                        {/* Price & Heart */}
                        <div className="flex justify-between items-center w-full mb-3 mt-auto">
                          <div className="h-5 bg-gray-200 dark:bg-slate-800 rounded w-1/3" />
                          <div className="h-4 w-4 bg-gray-200 dark:bg-slate-800 rounded-full" />
                        </div>
                        {/* Buttons */}
                        <div className="flex gap-2 w-full mt-2">
                          <div className="w-10 h-10 bg-gray-200 dark:bg-slate-800 rounded" />
                          <div className="flex-1 h-10 bg-gray-200 dark:bg-slate-800 rounded" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivalSkeleton;
