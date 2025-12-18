"use client";
import { useState, useEffect, useRef } from "react";
import BlogCard from "@/components/BlogCard";
import { BlogType } from "@/types/blogsType";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface LazyBlogGridProps {
  initialBlogs: BlogType[];
  isEditing?: boolean;
}

export default function LazyBlogGrid({
  initialBlogs,
  isEditing,
}: LazyBlogGridProps) {
  const [displayedBlogs, setDisplayedBlogs] = useState(
    initialBlogs.slice(0, 9)
  );
  const [hasMore, setHasMore] = useState(initialBlogs.length > 9);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const BLOGS_PER_PAGE = 9;

  // Add this useEffect to reset when initialBlogs changes
  useEffect(() => {
    setDisplayedBlogs(initialBlogs.slice(0, BLOGS_PER_PAGE));
    setHasMore(initialBlogs.length > BLOGS_PER_PAGE);
  }, [initialBlogs]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          const currentLength = displayedBlogs.length;
          const nextBlogs = initialBlogs.slice(
            0,
            currentLength + BLOGS_PER_PAGE
          );
          setDisplayedBlogs(nextBlogs);

          if (nextBlogs.length >= initialBlogs.length) {
            setHasMore(false);
          }
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [displayedBlogs, initialBlogs, hasMore]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      // Header animation
      gsap.from(headerRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      // Cards stagger animation
      gsap.from(cardsRef.current, {
        y: 100,
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        ease: "power3.out",
        stagger: {
          amount: 0.8,
          from: "start",
        },
        scrollTrigger: {
          trigger: cardsRef.current[0],
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: sectionRef }
  );
  return (
    <div ref={sectionRef}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {displayedBlogs.map((blog: BlogType, index: number) => (
          <div
          key={blog._id}
            ref={(el) => {
              cardsRef.current[index] = el;
            }}>
              <BlogCard blogs={blog} isEditing={isEditing} />
          </div>
          
        ))}
      </div>

      {/* Load more trigger */}
      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}

      {/* Counter */}
      <div className="text-center text-gray-500 mt-8">
        Showing {displayedBlogs.length} of {initialBlogs.length} posts
      </div>
    </div>
  );
}
