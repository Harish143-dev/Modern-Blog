"use client";

import React, { useRef } from "react";
import { BlogType } from "@/types/blogsType";
import BlogCard from "./BlogCard";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";

gsap.registerPlugin(ScrollTrigger);

const LatestBlog = ({ blogs }: { blogs: BlogType[] }) => {
  const latestBlog = blogs.slice(0, 6);
  const sectionRef = useRef<HTMLElement>(null);
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
    <section
      ref={sectionRef}
      className="w-full px-4 md:px-14 mt-10 pb-5 overflow-hidden"
    >
      <div className="flex-between w-full" ref={headerRef}>
        <div>
          <h2 className="text-3xl font-bold text-foreground">Latest Blogs</h2>
          <p className="text-muted-foreground mt-1">
            Stay updated with the newest articles and stories
          </p>
        </div>
        <Link
          href="/blogs"
          className="hidden sm:flex items-center gap-2 text-sm font-medium text-secondary hover:text-secondary/90 transition-colors group"
        >
          View all
          <FaArrowRight className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {latestBlog.map((blog, index) => (
          <div
            key={blog._id}
            ref={(el) => {
              cardsRef.current[index] = el;
            }}
          >
            <BlogCard blogs={blog} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default LatestBlog;
