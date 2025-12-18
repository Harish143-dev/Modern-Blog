"use client";

import React, { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { OURTEAMS } from "@/constant";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const OurTeams: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLHeadingElement | null>(null);
  const cardsRef = useRef<Array<HTMLDivElement | null>>([]);

  useGSAP(() => {
    if (!sectionRef.current) return;

    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];

    // Set initial state for header
    if (headerRef.current) {
      gsap.set(headerRef.current, { y: 40, opacity: 0 });
    }

    // Set initial state for cards
    if (cards.length) {
      gsap.set(cards, { y: 60, opacity: 0, scale: 0.9 });
    }

    // Create timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    });

    // Animate header with smooth bounce
    if (headerRef.current) {
      tl.to(headerRef.current, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power4.out",
      });
    }

    // Animate cards with elegant stagger
    if (cards.length) {
      tl.to(
        cards,
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.2)",
          stagger: {
            amount: 0.6,
            from: "start",
            ease: "power2.inOut"
          },
        },
        "-=0.7"
      );
    }

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, { scope: sectionRef });

  return (
    <div className="mt-15" ref={sectionRef}>
      <h1
        className="text-2xl md:text-4xl font-bold text-start"
        ref={headerRef}
      >
        Meet our creative teams
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full gap-5 mt-10">
        {OURTEAMS.map((emp, index) => (
          <div
            key={emp.id}
            ref={(el) => {
              cardsRef.current[index] = el;
            }}
            className="bg-card text-card-foreground rounded-2xl shadow-md w-full hover:shadow-2xl transform-gpu hover:scale-105 hover:-translate-y-2 transition-all duration-500 ease-out will-change-transform"
          >
            <div className="h-92 relative w-full overflow-hidden rounded-t-2xl">
              <Image
                src={emp.img}
                alt={emp.name || "team image"}
                fill
                className="absolute object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>
            <div className="p-3">
              <p className="text-lg font-semibold">{emp.name}</p>
              <p className="text-sm text-muted-foreground">{emp.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurTeams;