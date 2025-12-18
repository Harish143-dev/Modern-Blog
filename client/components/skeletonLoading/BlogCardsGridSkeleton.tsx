import { Skeleton } from "../ui/skeleton";
import BlogCardSkeleton from "./BlogCardSkeleton ";

export const BlogCardsGridSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="w-full px-4 md:px-14 py-20 overflow-hidden">
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-5 w-96 mt-2" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {Array.from({ length: count }).map((_, i) => (
          <BlogCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};
