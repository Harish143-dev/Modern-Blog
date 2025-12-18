"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BlogType } from "@/types/blogsType";
import { FaAngleLeft, FaAngleRight, FaArrowLeft, FaArrowRight } from "react-icons/fa6";

const BlogsSlider = ({ blogs }: { blogs: BlogType[] }) => {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRefs = useRef<(HTMLDivElement | null)[]>([]);
  const router = useRouter();

  // Get latest blog from each category
  const latestBlogsByCategory = useMemo(() => {
    const categoryMap = new Map<string, BlogType>();

    // Sort blogs by date (newest first)
    const sortedBlogs = [...blogs].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Pick first (latest) blog for each category
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

    const prevSlide = slideRefs.current[current];
    const prevContent = contentRefs.current[current];
    const prevProgress = progressRefs.current[current];

    const nextSlide = slideRefs.current[index];
    const nextContent = contentRefs.current[index];
    const nextProgress = progressRefs.current[index];

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrent(index);
        setIsAnimating(false);
      },
    });

    // Animate out current slide
    tl.to([prevProgress, prevContent], {
      opacity: 0,
      y: 30,
      duration: 0.3,
      ease: "power2.in",
      stagger: 0.05,
    })
      .to(
        prevSlide,
        {
          opacity: 0,
          scale: 0.95,
          duration: 0.4,
          ease: "power2.inOut",
        },
        "-=0.2"
      )
      // Animate in next slide
      .fromTo(
        nextSlide,
        { opacity: 0, scale: 1.1 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.2"
      )
      .fromTo(
        nextContent,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
        "-=0.3"
      )
      .fromTo(
        nextProgress,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" },
        "-=0.3"
      );
  };

  const next = () => goTo((current + 1) % latestBlogsByCategory.length);
  const prev = () =>
    goTo(
      (current - 1 + latestBlogsByCategory.length) %
        latestBlogsByCategory.length
    );

  useEffect(() => {
    if (latestBlogsByCategory.length === 0) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [current, latestBlogsByCategory.length]);

  // Initial animation on mount
  useEffect(() => {
    if (latestBlogsByCategory.length === 0) return;

    const currentSlide = slideRefs.current[current];
    const currentContent = contentRefs.current[current];
    const currentProgress = progressRefs.current[current];

    if (!currentSlide || !currentContent || !currentProgress) return;

    gsap.set(currentSlide, { opacity: 1, scale: 1 });
    gsap.set(currentContent, { y: 0, opacity: 1 });
    gsap.set(currentProgress, { y: 0, opacity: 1 });

    const tl = gsap.timeline();

    tl.fromTo(
      currentSlide,
      { opacity: 0, scale: 1.1 },
      { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" }
    )
      .fromTo(
        currentContent,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        "-=0.4"
      )
      .fromTo(
        currentProgress,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
        "-=0.3"
      );
  }, [latestBlogsByCategory.length]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatViews = (v: number) =>
    v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toString();

  if (latestBlogsByCategory.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-2xl shadow-2xl">
      <div className="relative h-96 md:h-[500px]">
        {latestBlogsByCategory.map((blog, i) => (
          <div
            key={blog._id}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            className="absolute inset-0"
            style={{
              opacity: i === current ? 1 : 0,
              zIndex: i === current ? 10 : 0,
              pointerEvents: i === current ? "auto" : "none",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent z-10" />
            <Image
              src={blog.blogImages}
              alt={blog.title}
              fill
              className="object-cover object-center"
            />

            <div
              ref={(el) => {
                contentRefs.current[i] = el;
              }}
              className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-20"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full backdrop-blur-sm">
                  {blog.category}
                </span>
                <span className="text-gray-300 text-sm">
                  {formatDate(blog.createdAt)}
                </span>
              </div>

              <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight">
                {blog.title}
              </h2>

              <div
                ref={(el) => {
                  progressRefs.current[i] = el;
                }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-semibold overflow-hidden">
                    {blog.author.profilePic ? (
                      <Image
                        src={blog.author.profilePic}
                        alt="profile"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      blog.author.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="text-white font-medium">{blog.author.name}</p>
                    <p className="text-gray-400 text-sm">
                      {formatViews(blog.views)} views
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => router.push(`/blogs/${blog.slug}`)}
                  className="group flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white font-medium transition-all duration-300"
                >
                  Read More
                  <FaArrowRight />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        disabled={isAnimating}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FaAngleLeft className="w-6 h-6" />
      </button>
      <button
        onClick={next}
        disabled={isAnimating}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
      >
         <FaAngleRight className="w-6 h-6" />
      </button>

      {/* Dots & Progress */}
      <div className="absolute bottom-0 left-0 right-0 z-30">
        <div className="flex justify-center gap-2 pb-4">
          {latestBlogsByCategory.map((blog, i) => (
            <button
              key={blog._id}
              onClick={() => goTo(i)}
              disabled={isAnimating}
              className={`relative h-1.5 rounded-full transition-all duration-500 overflow-hidden disabled:cursor-not-allowed ${
                i === current
                  ? "w-8 bg-white/30"
                  : "w-1.5 bg-white/30 hover:bg-white/50"
              }`}
              title={blog.category}
            >
              {i === current && (
                <span
                  className="absolute inset-0 bg-white rounded-full origin-left"
                  style={{
                    animation: "progress 5s linear forwards",
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes progress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
};

export default BlogsSlider;
