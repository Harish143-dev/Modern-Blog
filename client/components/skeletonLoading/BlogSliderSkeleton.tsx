import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

const BlogsSliderSkeleton = () => {
  return (
    <div className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-2xl shadow-2xl">
      <div className="relative h-96 md:h-[500px]">
        {/* Background Image Skeleton */}
        <Skeleton className="absolute inset-0" />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent z-10" />

        {/* Content Skeleton */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-20">
          {/* Category & Date */}
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="h-6 w-20 rounded-full bg-white/20" />
            <Skeleton className="h-5 w-28 bg-white/20" />
          </div>

          {/* Title - 2 lines */}
          <div className="space-y-3 mb-4">
            <Skeleton className="h-10 w-4/5 bg-white/20" />
            <Skeleton className="h-10 w-3/5 bg-white/20" />
          </div>

          {/* Author Info & Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full bg-white/20" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-24 bg-white/20" />
                <Skeleton className="h-4 w-20 bg-white/20" />
              </div>
            </div>

            {/* Read More Button Skeleton */}
            <Skeleton className="h-10 w-32 rounded-full bg-white/20" />
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        disabled
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white opacity-50 cursor-not-allowed"
      >
        <FaAngleLeft className="w-6 h-6" />
      </button>
      <button
        disabled
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white opacity-50 cursor-not-allowed"
      >
        <FaAngleRight className="w-6 h-6" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-0 left-0 right-0 z-30">
        <div className="flex justify-center gap-2 pb-4">
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
    </div>
  );
};

export default BlogsSliderSkeleton;