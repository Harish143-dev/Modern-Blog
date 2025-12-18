import BlogsSlider from "@/components/BlogsSlider";
import HeroSection from "@/components/HeroSection";
import Categories from "@/components/Categories";
import { Suspense } from "react";
import HighestViewsBlogsSkeleton from "@/components/skeletonLoading/HighestViewsBlogsSkeleton";
import TodayHighlightSkeleton from "@/components/skeletonLoading/TodayHighlightSkeleton";
import LatestBlogSkeleton from "@/components/skeletonLoading/LatestBlogSkeleton";
import BlogsSliderSkeleton from "@/components/skeletonLoading/BlogSliderSkeleton";

// Async wrapper components that fetch their own data

import {
  BlogSliderAsync,
  HighestViewsBlogsAsync,
  TodayHighlightAsync,
  LatestBlogAsync,
  CategoriesAsync,
} from "@/components/AsyncComponent";
import CategoriesSkeleton from "@/components/skeletonLoading/CategoriesSkeleton";

export default function Home() {
  return (
    <main>
      <HeroSection />

      {/* Each section loads independently */}
      <Suspense fallback={<HighestViewsBlogsSkeleton />}>
        <HighestViewsBlogsAsync />
      </Suspense>

      <Suspense fallback={<BlogsSliderSkeleton />}>
        <BlogSliderAsync />
      </Suspense>

      <Suspense fallback={<TodayHighlightSkeleton />}>
        <TodayHighlightAsync />
      </Suspense>
      <Suspense fallback={<CategoriesSkeleton />}>
        <CategoriesAsync />
      </Suspense>

      <Suspense fallback={<LatestBlogSkeleton />}>
        <LatestBlogAsync />
      </Suspense>
    </main>
  );
}
