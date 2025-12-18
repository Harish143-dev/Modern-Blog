"use client";
import { useState, useEffect, useRef } from "react";
import BlogCard from "@/components/BlogCard";
import { BlogType } from "@/types/blogsType";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const prevLengthRef = useRef(0);

  const BLOGS_PER_PAGE = 9;

  // Reset when initialBlogs changes
  useEffect(() => {
    setDisplayedBlogs(initialBlogs.slice(0, BLOGS_PER_PAGE));
    setHasMore(initialBlogs.length > BLOGS_PER_PAGE);
    prevLengthRef.current = 0;
  }, [initialBlogs]);

  // Intersection Observer for lazy loading
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

  // Animate cards whenever new ones are added
  useGSAP(
    () => {
      const newCards = cardsRef.current.slice(prevLengthRef.current);
      
      if (newCards.length > 0) {
        // Filter out null refs
        const validCards = newCards.filter(card => card !== null);
        
        if (validCards.length > 0) {
          gsap.fromTo(
            validCards,
            {
              y: 60,
              opacity: 0,
              scale: 0.9,
            },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.6,
              ease: "power2.out",
              stagger: 0.08,
              clearProps: "all", // Clean up inline styles after animation
            }
          );
        }
      }
      
      prevLengthRef.current = displayedBlogs.length;
    },
    { dependencies: [displayedBlogs.length], scope: sectionRef }
  );

  return (
    <div ref={sectionRef}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {displayedBlogs.map((blog: BlogType, index: number) => (
          <div
            key={blog._id}
            ref={(el) => {
              cardsRef.current[index] = el;
            }}
          >
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