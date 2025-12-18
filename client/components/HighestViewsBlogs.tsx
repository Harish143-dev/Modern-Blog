"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { BlogType } from "@/types/blogsType";
import HighestViewsBlogsSkeleton from "./skeletonLoading/HighestViewsBlogsSkeleton";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface HighestViewsBlogsProps {
  blogs: BlogType[];
  isLoading?: boolean;
}

const HighestViewsBlogs = ({
  blogs,
  isLoading = false,
}: HighestViewsBlogsProps) => {
  const [sortBlogs, setSortBlogs] = useState<BlogType[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    if (blogs && blogs.length > 0) {
      const sorted = [...blogs]
        .sort((a, b) => b.views - a.views)
        .slice(0, 3);

      setSortBlogs(sorted);
    }
  }, [blogs]);

  useGSAP(
    () => {
      if (sortBlogs.length === 0) return;

      const validCards = cardsRef.current.filter(card => card !== null);

      if (validCards.length > 0) {
        // Initial state
        gsap.set(validCards, {
          opacity: 0,
          y: 80,
          scale: 0.9,
          rotateX: -15,
        });

        // Animate in with scroll trigger
        gsap.to(validCards, {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 1,
          ease: "power3.out",
          stagger: {
            amount: 0.4,
            from: "start",
          },
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            end: "top 50%",
            toggleActions: "play none none reverse",
          },
        });

        // Hover animations for each card
        validCards.forEach((card) => {
          const image = card.querySelector("img");
          const content = card.querySelector(".card-content");
          const badge = card.querySelector(".badge");

          card.addEventListener("mouseenter", () => {
            gsap.to(card, {
              y: -8,
              scale: 1.02,
              duration: 0.4,
              ease: "power2.out",
            });

            if (image) {
              gsap.to(image, {
                scale: 1.15,
                duration: 0.6,
                ease: "power2.out",
              });
            }

            if (badge) {
              gsap.to(badge, {
                scale: 1.05,
                duration: 0.3,
                ease: "back.out(2)",
              });
            }

            if (content) {
              gsap.to(content, {
                x: 5,
                duration: 0.3,
                ease: "power2.out",
              });
            }
          });

          card.addEventListener("mouseleave", () => {
            gsap.to(card, {
              y: 0,
              scale: 1,
              duration: 0.4,
              ease: "power2.out",
            });

            if (image) {
              gsap.to(image, {
                scale: 1,
                duration: 0.6,
                ease: "power2.out",
              });
            }

            if (badge) {
              gsap.to(badge, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out",
              });
            }

            if (content) {
              gsap.to(content, {
                x: 0,
                duration: 0.3,
                ease: "power2.out",
              });
            }
          });
        });
      }
    },
    { dependencies: [sortBlogs], scope: containerRef }
  );

  if (isLoading) {
    return <HighestViewsBlogsSkeleton />;
  }

  return (
    <div
      ref={containerRef}
      className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 px-5 md:px-10 lg:px-20 py-10"
      style={{ perspective: "1000px" }}
    >
      {sortBlogs.map((blog, index) => (
        <Link
          key={blog._id}
          href={`/blogs/${blog.slug}`}
          className="group flex-1"
          ref={(el) => {
            cardsRef.current[index] = el;
          }}
        >
          <div className="relative h-full min-h-[140px] rounded-xl overflow-hidden bg-card border border/50 hover:border-border transition-all duration-300 hover:shadow-lg hover:shadow">
            <div className="flex h-full">
              {/* Image */}
              <div className="relative w-1/3 min-w-[140px] overflow-hidden">
                <img
                  src={blog.blogImages}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/20" />
              </div>

              {/* Content */}
              <div className="card-content flex-1 p-4 flex flex-col justify-between">
                <div className="pb-2">
                  <span className="badge px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full backdrop-blur-sm inline-block">
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