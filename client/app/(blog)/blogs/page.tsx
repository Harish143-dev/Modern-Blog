"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import LazyBlogGrid from "@/components/LazyBlogGrid";
import { BlogCardsGridSkeleton } from "@/components/skeletonLoading/BlogCardsGridSkeleton";
import { BlogType } from "@/types/blogsType";
import { blogService } from "@/services/blog.service";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await blogService.getAllBlogs({
          published: true,
          page: 1,
          limit: 9,
        });
        setBlogs(res.data.blogs || []);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, []);

  if (loading) {
    return <BlogCardsGridSkeleton count={9} />;
  }

  return (
    <div className="px-4 md:px-14 py-8 pt-20 mx-auto">
      <h1 className="text-4xl font-bold mb-8">All Posts</h1>
      <LazyBlogGrid initialBlogs={blogs} />
    </div>
  );
}
