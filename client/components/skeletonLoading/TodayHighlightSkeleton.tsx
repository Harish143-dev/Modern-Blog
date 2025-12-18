import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

 const TodayHighlightSkeleton = () => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-12 mt-10">
      {/* Section Header Skeleton */}
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-80" />
        </div>
        <Skeleton className="hidden sm:block h-6 w-24" />
      </div>

      {/* Grid Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Card Skeleton */}
        <div className="relative h-full min-h-[500px] rounded-2xl overflow-hidden bg-card border border-border/50">
          <Skeleton className="absolute inset-0" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-5 w-28" />
            </div>
            
            <div className="space-y-2 mb-4">
              <Skeleton className="h-8 w-4/5" />
              <Skeleton className="h-8 w-3/5" />
            </div>
            
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        </div>

        {/* Side Cards Skeleton */}
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="relative h-full min-h-[150px] rounded-xl overflow-hidden bg-card border border-border/50"
            >
              <div className="flex h-full">
                <Skeleton className="w-1/3 min-w-[140px] h-full" />

                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-16 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-4/5" />
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-6 h-6 rounded-full" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TodayHighlightSkeleton;