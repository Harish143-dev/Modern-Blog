"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BlogType } from "@/types/blogsType";
import HighestViewsBlogsSkeleton from "./skeletonLoading/HighestViewsBlogsSkeleton";

interface HighestViewsBlogsProps {
  blogs: BlogType[];
  isLoading?: boolean;
}

const HighestViewsBlogs = ({
  blogs,
  isLoading = false,
}: HighestViewsBlogsProps) => {
  const [sortBlogs, setSortBlogs] = useState<BlogType[]>([]);

  useEffect(() => {
    if (blogs && blogs.length > 0) {
      const sorted = [...blogs] // copy to avoid mutating original
        .sort((a, b) => b.views - a.views)
        .slice(0, 3);

      setSortBlogs(sorted);
    }
  }, [blogs]);

  if (isLoading) {
    return <HighestViewsBlogsSkeleton />;
  }

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 px-5 md:px-10 lg:px-20 py-10">
      {sortBlogs.map((blog) => (
        <Link
          key={blog._id}
          href={`/blogs/${blog.slug}`}
          className="group flex-1"
        >
          <div className="relative h-full min-h-[140px] rounded-xl overflow-hidden bg-card border border/50 hover:border-border transition-all duration-300 hover:shadow-lg hover:shadow">
            <div className="flex h-full">
              {/* Image */}
              <div className="relative w-1/3 min-w-[140px] overflow-hidden">
                <img
                  src={blog.blogImages}
                  alt={blog.title}
                  className="w-full h-full object-cover obj transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/20" />
              </div>

              {/* Content */}
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div className="pb-2">
                  <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full backdrop-blur-sm">
                  {blog.category}
                </span>
                </div>
                <div>
                  <h4 className="text-base font-semibold text-foreground leading-snug group-hover:underline transition-all line-clamp-2">
                    {blog.title}
                  </h4>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <div className="relative w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-semibold">
                      {blog.author.profilePic ? (
                        <Image
                          src={blog.author.profilePic}
                          alt="profile"
                          fill
                          className="object-cover rounded-full"
                        />
                      ) : (
                        blog.author.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {blog.author.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default HighestViewsBlogs;
