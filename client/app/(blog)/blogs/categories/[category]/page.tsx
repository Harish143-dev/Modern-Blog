import BlogCard from "@/components/BlogCard";
import LazyBlogGrid from "@/components/LazyBlogGrid";
import { BlogCardsGridSkeleton } from "@/components/skeletonLoading/BlogCardsGridSkeleton";
import { blogService } from "@/services/blog.service";
import { useState } from "react";

export default async function CategoryPage({ params }: any) {
  const resolvedParams = await params; // FIX
  const category = resolvedParams.category; // NOW SAFE
  const [loading, setLoading] = useState(true);

  if (!category) {
    return (
      <div className="p-10 text-center text-red-500">Invalid category</div>
    );
  }

  let data;
  try {
    data = await blogService.getBlogByCategory(category);
  } catch (err) {
    return (
      <div className="p-10 flex-center min-h-screen">
        <h1 className="text-lg md:text-2xl font-bold text-primary">
          <span className="text-4xl md:text-7xl font-bold text-secondary">
            Oops!
          </span>{" "}
          No blogs found in this category.
        </h1>
      </div>
    );
  } finally {
    setLoading(false);
  }
  if (loading) return <BlogCardsGridSkeleton count={data.blog.length} />;
  return (
    <div className="px-4 md:px-14 py-8 pt-20 m-auto">
      <h1 className="text-2xl md:text-4xl font-bold mb-8">
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </h1>

      <LazyBlogGrid initialBlogs={data.blogs} />
    </div>
  );
}
