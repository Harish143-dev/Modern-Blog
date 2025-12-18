import { Suspense } from "react";
import BlogCard from "@/components/BlogCard";
import LazyBlogGrid from "@/components/LazyBlogGrid";
import { BlogCardsGridSkeleton } from "@/components/skeletonLoading/BlogCardsGridSkeleton";

// Fetch blogs on server (SSR)
async function getBlogs() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/blogs?published=true`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch blogs");
  }

  return res.json();
}

export default async function BlogsPage() {
  const data = await getBlogs();
  const blogs = data.blogs;

  return (
    <div className="px-4 md:px-14 py-8 pt-20 mx-auto">
      <h1 className="text-4xl font-bold mb-8">All Posts</h1>

      <Suspense fallback={<BlogCardsGridSkeleton count={blogs.length} />}>
        <LazyBlogGrid initialBlogs={blogs} />
      </Suspense>
    </div>
  );
}
