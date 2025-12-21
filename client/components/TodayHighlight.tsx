"use client";
import React, { useRef } from "react";
import Link from "next/link";
import { BlogType } from "@/types/blogsType";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa6";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TodayHighlightSkeleton from "./skeletonLoading/TodayHighlightSkeleton";

gsap.registerPlugin(ScrollTrigger);

// Skeleton Component

const TodayHighlight = ({ blogs }: { blogs: BlogType[] }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const mainCardRef = useRef<HTMLAnchorElement>(null);
  const sideCardsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!blogs.length) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.from(headerRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      // Main card animation
      gsap.from(mainCardRef.current, {
        x: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: mainCardRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      // Side cards stagger animation
      const sideCards = sideCardsRef.current?.querySelectorAll("a");
      if (sideCards) {
        gsap.from(sideCards, {
          x: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sideCardsRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [blogs]);

  // Get first 4 blogs
  const highlightBlogs = blogs.slice(0, 4);
  const mainBlog = highlightBlogs[0];
  const sideBlogs = highlightBlogs.slice(1, 4);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatViews = (v: number) =>
    v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toString();

  if (!mainBlog) return null;

  return (
    <section
      ref={sectionRef}
      className="w-full max-w-7xl mx-auto px-4 py-12 mt-10 overflow-hidden"
    >
      {/* Section Header */}
      <div ref={headerRef} className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            Today's Highlights
          </h2>
          <p className="text-muted-foreground mt-1">
            Discover the most popular stories today
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

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - Main Big Card */}
        <Link
          ref={mainCardRef}
          href={`/blogs/${mainBlog.slug}`}
          className="group"
        >
          <div className="relative h-full min-h-[500px] rounded-2xl overflow-hidden bg-gray-900">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent z-10" />
            <Image
              src={mainBlog.blogImages}
              alt={mainBlog.title}
              fill
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full backdrop-blur-sm">
                  {mainBlog.category || "Featured"}
                </span>
                <span className="text-gray-300 text-sm">
                  {formatDate(mainBlog.createdAt)}
                </span>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight group-hover:text-violet-200 transition-colors">
                {mainBlog.title}
              </h3>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                    {mainBlog.author.profilePic ? (
                      <Image
                        src={mainBlog.author.profilePic}
                        alt="profile"
                        fill
                        className="rounded-full"
                      />
                    ) : (
                      mainBlog.author.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {mainBlog.author.name}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {formatViews(mainBlog.views)} views
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Right Side - 3 Stacked Cards */}
        <div ref={sideCardsRef} className="flex flex-col gap-4">
          {sideBlogs.map((blog, index) => (
            <Link
              key={blog._id}
              href={`/blogs/${blog.slug}`}
              className="group flex-1"
            >
              <div className="relative h-full min-h-[150px] rounded-xl overflow-hidden bg-card border border-border/50 transition-all duration-300 hover:shadow-lg">
                <div className="flex h-full">
                  {/* Image */}
                  <div className="relative w-1/3 min-w-[140px] overflow-hidden">
                    <Image
                      src={blog.blogImages}
                      alt={blog.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/20" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                          {blog.category || "Blog"}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {formatDate(blog.createdAt)}
                        </span>
                      </div>

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
                              className="rounded-full"
                            />
                          ) : (
                            blog.author.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {blog.author.name}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatViews(blog.views)} views
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export { TodayHighlightSkeleton };
export default TodayHighlight;
