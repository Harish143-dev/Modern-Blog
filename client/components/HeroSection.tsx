"use client";
import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const descRef = useRef<HTMLParagraphElement | null>(null);
  const linksRef = useRef<HTMLDivElement | null>(null);
  const bgOverlayRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      // Null checks
      if (
        !titleRef.current ||
        !subtitleRef.current ||
        !descRef.current ||
        !linksRef.current ||
        !bgOverlayRef.current
      ) {
        return;
      }

      // Split text animation for title
      const titleText = titleRef.current.textContent;
      if (!titleText) return;

      const words = titleText.split(" ");
      titleRef.current.innerHTML = words
        .map((word) => `<span class="word">${word}</span>`)
        .join(" ");

      const wordElements = titleRef.current.querySelectorAll(".word");

      // Set initial states
      gsap.set(
        [wordElements, subtitleRef.current, descRef.current, linksRef.current],
        {
          opacity: 0,
          y: 50,
        }
      );

      // Background zoom animation
      gsap.fromTo(
        bgOverlayRef.current,
        { scale: 1.3, opacity: 0 },
        { scale: 1, opacity: 1, duration: 2, ease: "power3.out" }
      );

      // Create timeline for text animations
      const tl = gsap.timeline({ delay: 0.3 });

      // Animate each word
      tl.to(wordElements, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.7)",
      })
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.4"
        )
        .to(
          descRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.6"
        )
        .to(
          linksRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.6"
        );

      // Parallax effect on scroll
      const handleScroll = () => {
        if (!bgOverlayRef.current) return;
        const scrollY = window.scrollY;
        gsap.to(bgOverlayRef.current, {
          y: scrollY * 0.5,
          duration: 0.5,
        });
      };

      window.addEventListener("scroll", handleScroll);

      return () => window.removeEventListener("scroll", handleScroll);
    },
    { scope: heroRef }
  );

  return (
    <div
      ref={heroRef}
      className="relative min-h-screen flex-center overflow-hidden"
    >
      {/* Animated Background */}
      <div
        ref={bgOverlayRef}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/img/img3.png')`,
          willChange: "transform",
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/50" />
      </div>

      {/* Content */}
      <div className="relative h-full flex justify-center items-center px-4 z-10">
        <div className="flex flex-col justify-center items-center max-w-4xl gap-8 text-center ">
          <h1
            ref={titleRef}
            className="text-4xl md:text-6xl font-bold  leading-tight interHeading"
            style={{ perspective: "1000px" }}
          >
            Stories, Ideas & Inspiration for Curious Minds
          </h1>

          <p ref={subtitleRef} className="text-xl md:text-2xl font-semibold">
            A digital journal where thoughts transform into meaningful
            conversations.
          </p>

          <p ref={descRef} className="text-base md:text-lg  max-w-2xl">
            Here you'll find long-form reads, creative perspectives, and
            thoughtful reflections designed to spark curiosity. Get inspired by
            content that blends knowledge, imagination, and real-life
            experiences.
          </p>

          <div
            ref={linksRef}
            className="flex items-center justify-center gap-5 flex-wrap"
          >
            <Link
              href="/blogs"
              className="group text-lg font-semibold transition-all relative"
            >
              <span className="relative z-10">Explore Blogs</span>
              <span className="absolute bottom-0 left-0 w-0 bg-foreground h-0.5 transition-all duration-300 group-hover:w-full" />
            </Link>
            <span className="">|</span>
            <Link
              href="/blogs"
              className="group text-lg font-semibold transition-all relative"
            >
              <span className="relative z-10">Join the Journey</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-foreground transition-all duration-300 group-hover:w-full" />
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .word {
          display: inline-block;
          margin-right: 0.3em;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
