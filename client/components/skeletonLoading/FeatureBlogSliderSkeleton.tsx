import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const FeatureBlogSliderSkeleton = () => {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl">
      {/* Main Slide Container */}
      <div className="relative h-78 md:h-[400px]">
        {/* Background Image Skeleton */}
        <Skeleton className="absolute inset-0 w-full h-full" />

        {/* Overlay Gradient (same as original) */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent z-10" />

        {/* Category & Date Skeleton */}
        <div className="flex items-center gap-3 mb-4 absolute top-4 left-4 z-20">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-5 w-28" />
        </div>

        {/* Content Skeleton */}
        <div className="absolute bottom-3 left-0 right-0 p-3 md:p-5 z-20">
          {/* Title Skeleton - 2 lines */}
          <div className="space-y-2">
            <Skeleton className="h-7 w-4/5 bg-white/20" />
            <Skeleton className="h-7 w-3/5 bg-white/20" />
          </div>
        </div>
      </div>

      {/* Dot Navigation Skeleton */}
      <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton
            key={i}
            className={`h-1.5 rounded-full bg-white/30 ${
              i === 1 ? "w-8" : "w-1.5"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeatureBlogSliderSkeleton;