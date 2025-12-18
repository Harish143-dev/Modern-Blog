import { Suspense } from "react";
import LazyBlogGrid from "@/components/LazyBlogGrid";
import { BlogCardsGridSkeleton } from "@/components/skeletonLoading/BlogCardsGridSkeleton";
import axios from "axios";

export const dynamic = "force-dynamic";
// Fetch blogs on server (SSR)
async function getBlogs() {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/blogs`, {
      params: { published: true },
      timeout: 5000, // prevents hanging build
    });

    return res.data ?? [];
  } catch (error) {
    console.error("getBlogs failed:", error);
    return []; // 🚨 NEVER throw during build
  }
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
