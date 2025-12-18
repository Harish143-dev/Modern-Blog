import { Skeleton } from "@/components/ui/skeleton";
import BlogsSliderSkeleton from "./BlogSliderSkeleton";

export default function DashboardSkeleton() {
  return (
    <div className="bg-card text-card-foreground w-[90%] flex justify-center items-center flex-col p-5 mt-20 rounded-2xl shadow-2xl">
      {/* Cover Image Skeleton */}
      <Skeleton className="w-full h-48 rounded-t-2xl" />

      <div className="flex-col md:flex-row flex justify-between items-center gap-5 w-full relative -top-16 px-5 md:px-15 border-b pb-5">
        {/* Profile Section */}
        <div className="flex items-center justify-center flex-col md:w-1/2">
          {/* Profile Picture Skeleton */}
          <Skeleton className="w-40 h-40 rounded-full" />

          {/* Welcome Text Skeleton */}
          <Skeleton className="h-8 w-64 mt-4" />

          {/* Email Skeleton */}
          <Skeleton className="h-5 w-48 mt-2" />

          {/* Joined Date Skeleton */}
          <Skeleton className="h-4 w-40 mt-1" />
        </div>

        {/* Stats and Bio Section */}
        <div className="flex flex-col gap-5 w-full pt-5 md:pt-20">
          <div className="flex-col md:flex-row gap-3 flex justify-between items-center md:px-20 w-full">
            {/* Stats */}
            <div className="flex items-center justify-center gap-5">
              <div className="text-center">
                <Skeleton className="h-8 w-16 mx-auto" />
                <Skeleton className="h-5 w-12 mx-auto mt-1" />
              </div>
              <div className="text-center">
                <Skeleton className="h-8 w-16 mx-auto" />
                <Skeleton className="h-5 w-12 mx-auto mt-1" />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>

          {/* Bio Section */}
          <div className="bg-background w-full p-5 rounded-2xl">
            <Skeleton className="h-6 w-16 mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4 mt-2" />
          </div>
        </div>
      </div>

      {/* Blogs Section */}
      <div className="w-full px-10 mt-5">
        <div className="w-full flex justify-between items-center mb-5">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-6 w-24" />
        </div>

        {/* Blog Cards Skeleton */}
        <BlogsSliderSkeleton />
      </div>
    </div>
  );
}
