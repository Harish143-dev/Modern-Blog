"use client";
import React, { Suspense, useEffect, useState } from "react";
import { blogService } from "../../../../services/blog.service";
import { useRouter } from "next/navigation";
import LazyBlogGrid from "@/components/LazyBlogGrid";
import { BlogCardsGridSkeleton } from "@/components/skeletonLoading/BlogCardsGridSkeleton";
import { BlogType } from "@/types/blogsType";
import { toast } from "sonner";

const UsersBlogs = () => {
  const router = useRouter();
  const [blogs, setBlogs] = useState<BlogType[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserBlogs = async () => {
      try {
     
        const token = localStorage.getItem("token");

        if (!token) {
          toast.error("No token found, redirecting to login");
          router.push("/login");
          return;
        }

        const response = await blogService.getUserBlogs();

        // Ensure it's an array
        setBlogs(response.blogs);
        setIsEditing(true);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs");
      } finally {
        setIsLoading(false);
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

  if (isLoading) {
    return <BlogCardsGridSkeleton count={9} />;
  }
  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-3xl font-bold mb-6">My Blogs</h1>

      <LazyBlogGrid initialBlogs={blogs} isEditing={isEditing} />
    </div>
  );
};

export default UsersBlogs;
