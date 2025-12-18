import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const BlogCardSkeleton = () => {
  return (
    <div className="group relative bg-card text-card-foreground rounded-3xl overflow-hidden shadow-sm border border-border">
      {/* Image Container Skeleton */}
      <div className="relative h-52 overflow-hidden">
        <Skeleton className="absolute inset-0" />

        {/* Category Badge Skeleton */}
        <div className="absolute top-4 left-4 z-10">
          <Skeleton className="h-7 w-20 rounded-full" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="px-6 py-4">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-border">
          {/* Author Section */}
          <div className="flex items-center gap-3">
            <Skeleton className="w-9 h-9 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>

          {/* Read Link Skeleton */}
          <Skeleton className="h-4 w-12" />
        </div>

        {/* Title Skeleton - 2 lines */}
        <div className="space-y-2 mb-3">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-4/5" />
        </div>

        {/* Description Skeleton - 2 lines */}
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* Tags Skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-16 rounded-md" />
          <Skeleton className="h-6 w-20 rounded-md" />
          <Skeleton className="h-6 w-14 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default BlogCardSkeleton;
