"use client";
import Image from "next/image";
import Link from "next/link";
import { BlogType } from "@/types/blogsType";
import { Calendar, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const BlogCard = ({
  blogs,
  isEditing,
}: {
  blogs: BlogType;
  isEditing?: boolean;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    const card = cardRef.current;
    if (!card) return;

    const image = card.querySelector(".blog-image");
    const overlay = card.querySelector(".image-overlay");
    const content = card.querySelector(".card-content");
    const title = card.querySelector(".blog-title");
    const arrow = card.querySelector(".arrow-icon");
    const tags = card.querySelector(".tags-container");

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.to(card, { y: -8, duration: 0.4 }, 0)
      .to(image, { scale: 1.1, duration: 0.6 }, 0)
      .to(overlay, { opacity: 0.3, duration: 0.3 }, 0)
      .to(content, { backgroundColor: "rgba(0,0,0,0.02)", duration: 0.3 }, 0)
      .to(arrow, { x: 4, y: -4, opacity: 1, duration: 0.3 }, 0)
      .to(tags, { x: 4, duration: 0.4 }, 0);
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;

    const image = card.querySelector(".blog-image");
    const overlay = card.querySelector(".image-overlay");
    const content = card.querySelector(".card-content");
    const title = card.querySelector(".blog-title");
    const arrow = card.querySelector(".arrow-icon");
    const tags = card.querySelector(".tags-container");

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.to(card, { y: 0, duration: 0.4 }, 0)
      .to(image, { scale: 1, duration: 0.6 }, 0)
      .to(overlay, { opacity: 0, duration: 0.3 }, 0)
      .to(content, { backgroundColor: "transparent", duration: 0.3 }, 0)
      .to(arrow, { x: 0, y: 0, opacity: 0, duration: 0.3 }, 0)
      .to(tags, { x: 0, duration: 0.4 }, 0);
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative bg-card text-card-foreground rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-border"
    >
      {/* Image Container */}
      <div className="relative h-52 overflow-hidden">
        <Image
          src={blogs.blogImages}
          alt={blogs.title}
          fill
          className="blog-image object-cover object-center"
        />
        <div className="image-overlay absolute inset-0 bg-primary/50 opacity-0" />

        {/* Category Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1.5 bg-primary backdrop-blur-sm text-xs font-semibold text-primary-foreground rounded-full shadow-sm">
            {blogs.category}
          </span>
        </div>

        {/* Arrow Icon */}
        <Link href={`/blogs/${blogs.slug}`} className="arrow-icon absolute top-4 right-4 z-10 opacity-0">
          <div className="w-10 h-10 bg-background rounded-full flex items-center justify-center shadow-md">
            <ArrowUpRight className="w-5 h-5 text-primary" />
          </div>
        </Link>
      </div>

      {/* Content */}
      <div className="card-content px-6 py-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-border">
          {/* Author */}
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full bg-secondary text-secondary-foreground flex-center overflow-hidden ring-2 ring-border">
              {blogs.author?.profilePic ? (
                <Image src={blogs.author.profilePic} alt="profile" fill className="object-cover object-center" />
              ) : (
                blogs.author?.name?.charAt(0).toUpperCase() ?? "U"
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">
                {blogs.author?.name ?? "Unknown"}
              </p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground/70">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(blogs.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Read Link */}
          <div className="flex-center gap-5">
            <Link
              href={`/blogs/${blogs.slug}`}
              className="text-sm font-semibold text-primary hover:text-primary-foreground/70 transition-colors"
            >
              Read
            </Link>
            {isEditing && (
              <Link
                href={`/dashboard/edit-blog/${blogs._id}`}
                className="ml-4 text-sm font-semibold text-secondary hover:text-secondary/70 transition-colors"
              >
                Edit
              </Link>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="blog-title text-foreground text-lg font-bold leading-snug mb-3 line-clamp-2">
          {blogs.title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
          {blogs.description}
        </p>

        {/* Tags */}
        <div className="tags-container flex items-center gap-2">
          {blogs.tags?.map((tag, index) => (
            <span
              key={index}
              className="px-2.5 py-1 bg-secondary/10 text-xs font-medium text-secondary rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
