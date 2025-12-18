"use client";
import { blogService } from "@/services/blog.service";
import React, { useEffect, useMemo, useState } from "react";
import { BlogType } from "@/types/blogsType";
import Link from "next/link";
import FeatureBlogSliderSkeleton from "./skeletonLoading/FeatureBlogSliderSkeleton";

const FeatureBlogSlider = () => {
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch blogs on mount
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await blogService.getAllBlogs();
        setBlogs(data.blogs);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Get latest blog from each category
  const latestBlogsByCategory = useMemo(() => {
    const categoryMap = new Map<string, BlogType>();
    const sortedBlogs = [...blogs].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    sortedBlogs.forEach((blog) => {
      if (!categoryMap.has(blog.category)) {
        categoryMap.set(blog.category, blog);
      }
    });

    return Array.from(categoryMap.values());
  }, [blogs]);

  const goTo = (index: number) => {
    if (isAnimating || index === current) return;
    setIsAnimating(true);
    setCurrent(index);
    setTimeout(() => setIsAnimating(false), 800);
  };

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (latestBlogsByCategory.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % latestBlogsByCategory.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [latestBlogsByCategory.length]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatViews = (v: number) =>
    v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toString();

  // ⭐ Show skeleton while loading
  if (loading) {
    return <FeatureBlogSliderSkeleton />;
  }

  if (latestBlogsByCategory.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl">
      {/* Slides Container */}
      <div className="relative h-78 md:h-[400px]">
        {latestBlogsByCategory.map((blog, i) => (
          <div
            key={blog._id}
            className={`absolute inset-0 transition-all duration-700 ease-out ${
              i === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent z-10" />

            {/* Background Image */}
            <img
              src={blog.blogImages}
              alt={blog.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Category & Date */}
            <div className="flex items-center gap-3 mb-4 absolute top-4 left-4 z-20">
              <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                {blog.category}
              </span>
              <span className="text-gray-300 text-sm">
                {formatDate(blog.createdAt)}
              </span>
            </div>
            
            {/* Content */}
            <div
              className={`absolute bottom-3 left-0 right-0 p-3 md:p-5 z-20 transition-all duration-700 ${
                i === current
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              {/* Title */}
              <Link
                href={`/blogs/${blog.slug}`}
                className="text-xl font-bold hover:underline transition-all text-white mb-4 leading-tight"
              >
                {blog.title}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Dot Navigation */}
      <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center gap-2">
        {latestBlogsByCategory.map((blog, i) => (
          <button
            key={blog._id}
            onClick={() => goTo(i)}
            className={`relative h-1.5 rounded-full transition-all duration-500 overflow-hidden ${
              i === current
                ? "w-8 bg-white/40"
                : "w-1.5 bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Go to ${blog.category}`}
          >
            {i === current && (
              <span
                key={current}
                className="absolute inset-0 bg-white rounded-full origin-left"
                style={{
                  animation: "progress 5s linear forwards",
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Progress Animation */}
      <style>{`
        @keyframes progress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
};

export default FeatureBlogSlider;