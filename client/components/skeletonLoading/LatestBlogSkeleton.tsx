import React from "react";
import { Skeleton } from "../ui/skeleton";
import { BlogCardsGridSkeleton } from "./BlogCardsGridSkeleton";

const LatestBlogSkeleton = () => {
  return (
    <section className="w-full px-4 md:px-14 py-12 overflow-hidden">
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-5 w-96 mt-2" />

      <BlogCardsGridSkeleton />
    </section>
  );
};

export default LatestBlogSkeleton;
