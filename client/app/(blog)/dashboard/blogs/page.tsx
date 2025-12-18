"use client";
import React, { Suspense, useEffect, useState } from "react";
import { blogService } from "../../../../services/blog.service";
import { useRouter } from "next/navigation";
import LazyBlogGrid from "@/components/LazyBlogGrid";
import { BlogCardsGridSkeleton } from "@/components/skeletonLoading/BlogCardsGridSkeleton";
import { BlogType } from "@/types/blogsType";

const UsersBlogs = () => {
  const router = useRouter();
  const [blogs, setBlogs] = useState<BlogType[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserBlogs = async () => {
      try {
        // Check for token
        const token = localStorage.getItem("token");

        if (!token) {
          console.log("No token found, redirecting to login");
          router.push("/login");
          return;
        }

        const response = await blogService.getUserBlogs();

        // Ensure it's an array
        setBlogs(response.blogs);
        setIsEditing(true)
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs");
      } finally {
      }
    };

    fetchUserBlogs();
  }, [router]);

  if (error) {
    return (
      <div className="flex-center min-h-screen">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-3xl font-bold mb-6">My Blogs</h1>

      <Suspense fallback={<BlogCardsGridSkeleton count={blogs.length} />}>
        <LazyBlogGrid initialBlogs={blogs} isEditing={isEditing} />
      </Suspense>
    </div>
  );
};

export default UsersBlogs;
