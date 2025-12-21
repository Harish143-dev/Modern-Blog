"use client";
import React, { useEffect, useState } from "react";
import { authService } from "@/services/auth.service";
import { UserType } from "@/types/userType";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { blogService } from "@/services/blog.service";
import BlogsSlider from "./BlogsSlider";
import { BlogType } from "@/types/blogsType";
import { FaArrowRight, FaPlus } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import CoverImage from "./CoverImage";
import DashboardSkeleton from "./skeletonLoading/DashboardSkeleton";

const userProfile = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<BlogType[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    authService.getCurrentUser().then((res) => {
      setUser(res.user);
      setLoading(false);
    });

    blogService.getUserBlogs().then((res) => {
      setBlogs(res.blogs);
  
    });
  }, []);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatViews = (v: number) =>
    v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toString();

  const totalViews = blogs.reduce((sum, blog) => sum + (blog.views || 0), 0);

  const handleCoverImageUpdate = (newCoverImage: string) => {
    // Update local state when cover image changes
    if (user) {
      setUser({ ...user, coverImage: newCoverImage });
    }
  };

  if (loading) return <DashboardSkeleton />;

  if (!user)
    return (
      <div className="h-screen flex-center">
        Please log in to access the dashboard.
      </div>
    );
  return (
    <div className="bg-card text-card-foreground w-[90%] flex-center flex-col p-5 mt-20 rounded-2xl shadow-2xl">
      <CoverImage
        currentCoverImage={user.coverImage}
        onUpdate={handleCoverImageUpdate}
        editable={true}
      />
      <div className="flex-col md:flex-row flex-between gap-5 w-full relative -top-16 px-5 md:px-15 border-b pb-5">
        <div className="flex-center flex-col md:w-1/2">
          <div className="relative w-40 h-40 rounded-full bg-secondary flex items-center justify-center text-white text-xs font-semibold">
            {user.profilePic ? (
              <Image
                src={user.profilePic}
                alt={user.name}
                fill
                className="rounded-full object-cover"
              />
            ) : (
              user.name?.charAt(0).toUpperCase()
            )}
          </div>
          <p className="text-2xl font-semibold">
            Welcome, <span className="text-primary">{user?.name}</span>
          </p>
          <p className="font-medium text-muted-foreground">{user.email}</p>
          <p className="font-small text-muted-foreground">
            <span>Joined: </span>
            {formatDate(user.createdAt)}
          </p>
        </div>
        <div className="flex-base flex-col gap-5 w-full pt-5 md:pt-20">
          <div className="flex-col md:flex-row gap-3 flex-between md:px-20 w-full">
            <div className="flex-center gap-5">
              <div className="text-center font-semibold">
                <p className="text-2xl text-secondary">{blogs.length || 0}</p>
                <p className="text-muted-foreground text-lg">Post</p>
              </div>
              <div className="text-center font-semibold">
                <p className="text-2xl text-secondary">
                  {formatViews(totalViews) || 0}
                </p>
                <p className="text-muted-foreground text-lg">Reach</p>
              </div>
            </div>
            <div className="flex-center">
              <Link href="/dashboard/edit-profile">
                <Button
                  variant="link"
                  className="ml-4 text-primary bg-primary/20"
                >
                  Edit Profile
                  <FaEdit className="text-primary" />
                </Button>
              </Link>
              <Link href="/dashboard/create-blog">
                <Button
                  variant="link"
                  className="ml-4 text-primary bg-primary/20"
                >
                  Create Blog
                  <FaPlus className="text-primary" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="bg-background w-full p-5 rounded-2xl">
            <h2 className="text-lg font-bold mb-1">Bio</h2>
            <p className="text-muted-foreground">
              {user.bio || "This user has not added a Bio section yet."}
            </p>
          </div>
        </div>
      </div>
      {blogs.length > 0 ? (
        <div className="w-full">
          <div className="w-full flex-between mb-5">
            <h2 className="text-2xl font-bold ">Your Blogs</h2>
            <div className="flex-center gap-1">
              <Link
                href="/dashboard/blogs"
                className="text-primary font-semibold"
              >
                View All
              </Link>
              <span>
                <FaArrowRight className="text-primary" />
              </span>
            </div>
          </div>
          <BlogsSlider blogs={blogs} />
        </div>
      ) : (
        <div className="text-lg md:text-2xl text-primary font-bold ">
          You haven't posted any blogs yet!
        </div>
      )}
    </div>
  );
};

export default userProfile;
