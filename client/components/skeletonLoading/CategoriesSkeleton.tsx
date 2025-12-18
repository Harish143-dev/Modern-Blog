import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const CategoriesSkeleton = () => {
  return (
    <section className="w-full px-4 md:px-14 py-12 overflow-hidden">
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-5 w-96 mt-2" />

      {/* Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="relative h-72 rounded-2xl overflow-hidden shadow-lg bg-card border border-border/50"
          >
            {/* Background Image Skeleton */}
            <Skeleton className="absolute inset-0" />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Content Skeleton (bottom aligned) */}
            <div className="absolute inset-x-0 bottom-0 p-5 space-y-2">
              <Skeleton className="h-7 w-3/4 bg-white/20" />
              <Skeleton className="h-4 w-full bg-white/20" />
              <Skeleton className="h-4 w-5/6 bg-white/20" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSkeleton;
