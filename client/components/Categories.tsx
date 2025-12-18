"use client";

import React, { useRef } from "react";
import { CATEGORIES } from "../constant";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface CategoriesType {
  heading: string;
  para: string;
}

gsap.registerPlugin(ScrollTrigger);

const Categories = ({ heading, para }: CategoriesType) => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);

  // Scroll-triggered entrance animations
  useGSAP(
    () => {
      // Header animation
      gsap.from(headerRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
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
        scale: 0.9,
        duration: 0.8,
        ease: "power3.out",
        stagger: {
          amount: 0.6,
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

  const handleMouseEnter = (index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;

    const image = card.querySelector(".card-image");
    const defaultOverlay = card.querySelector(".default-overlay");
    const hoverOverlay = card.querySelector(".hover-overlay");
    const defaultContent = card.querySelector(".default-content");
    const hoverContent = card.querySelector(".hover-content");
    const button = card.querySelector(".visit-button");

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.to(image, { scale: 1.15, duration: 0.6 }, 0)
      .to(defaultOverlay, { opacity: 0, duration: 0.3 }, 0)
      .to(hoverOverlay, { opacity: 1, duration: 0.3 }, 0)
      .to(defaultContent, { opacity: 0, y: 20, duration: 0.3 }, 0)
      .to(hoverContent, { opacity: 1, y: 0, duration: 0.4 }, 0.1)
      .fromTo(
        button,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4 },
        0.2
      );
  };

  const handleMouseLeave = (index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;

    const image = card.querySelector(".card-image");
    const defaultOverlay = card.querySelector(".default-overlay");
    const hoverOverlay = card.querySelector(".hover-overlay");
    const defaultContent = card.querySelector(".default-content");
    const hoverContent = card.querySelector(".hover-content");
    const button = card.querySelector(".visit-button");

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.to(image, { scale: 1, duration: 0.6 }, 0)
      .to(defaultOverlay, { opacity: 1, duration: 0.3 }, 0)
      .to(hoverOverlay, { opacity: 0, duration: 0.3 }, 0)
      .to(defaultContent, { opacity: 1, y: 0, duration: 0.3 }, 0.1)
      .to(hoverContent, { opacity: 0, y: 20, duration: 0.3 }, 0)
      .to(button, { scale: 0.8, opacity: 0, duration: 0.2 }, 0);
  };

  return (
    <section ref={sectionRef} className="w-full px-4 md:px-14 py-12 overflow-hidden">
      <div ref={headerRef}>
        <h2 className="text-3xl font-bold text-foreground">{heading}</h2>
        <p className="text-muted-foreground mt-1">{para}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {CATEGORIES.map((category, index) => (
          <div
            key={category.id}
            ref={(el) => {
              cardsRef.current[index] = el;
            }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
            className="relative h-72 rounded-2xl overflow-hidden cursor-pointer shadow-lg"
          >
            {/* Background Image */}
            <Image
              src={category.image}
              alt={category.title}
              fill
              className="card-image object-cover object-center"
            />

            {/* Default Gradient Overlay */}
            <div className="default-overlay absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Hover Full Overlay */}
            <div className="hover-overlay absolute inset-0 bg-black/70 opacity-0" />

            {/* Default Content (bottom aligned) */}
            <div className="default-content absolute inset-x-0 bottom-0 p-5">
              <h3 className="text-xl font-bold text-white">{category.title}</h3>
              <p className="text-gray-300 text-sm mt-1 line-clamp-2">
                {category.description}
              </p>
            </div>

            {/* Hover Content (centered) */}
            <div className="hover-content absolute inset-0 flex flex-col items-center justify-center p-5 opacity-0 translate-y-5">
              <h3 className="text-xl font-bold text-white text-center">
                {category.title}
              </h3>
              <p className="text-gray-300 text-sm text-center mt-2 mb-5">
                {category.description}
              </p>
              <Link
                href={category.href}
                className="visit-button inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-colors opacity-0"
              >
                Visit
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
