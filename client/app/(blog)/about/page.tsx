"use client";
import Image from "next/image";
import React, { useRef } from "react";
import img1 from "../../../public/img/img1.png";
import img2 from "../../../public/img/img2.png";
import img3 from "../../../public/img/img3.png";
import OurTeams from "@/components/OurTeams";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const imagesRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLParagraphElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      // Heading animation
      gsap.from(headingRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 80%",
          end: "top 50%",
          toggleActions: "play none none reverse",
        },
      });

      // image animation
      gsap.from(".image-container", {
        opacity: 0,
        y: 100,
        scale: 0.8,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: imagesRef.current,
          start: "top 75%",
          end: "top 40%",
          toggleActions: "play none none reverse",
        },
      });

      // content animation
      gsap.from(".content-heading", {
        opacity: 0,
        y: 50,
        duration: 0.8,
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });
      gsap.from(".content-text", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.2,
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      // cards animation
      gsap.from(".card-item", {
        opacity: 0,
        y: 60,
        scale: 0.9,
        duration: 0.8,
        stagger: 0.3,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: containerRef }
  );
  return (
    <div
      ref={containerRef}
      className="text-center m-auto px-10 md:px-10 w-full py-20 "
    >
      <h1
        ref={headingRef}
        className="text-xl md:text-3xl font-bold max-w-2xl m-auto"
      >
        Connecting pepole with ideas that inform, inspire and empower
      </h1>
      <div ref={imagesRef} className="flex-center gap-5 w-full mt-10">
        <div className="relative h-90 w-full image-container">
          <Image
            src={img1}
            alt="img1"
            fill
            className="absolute rounded-2xl shadow-lg"
          />
        </div>
        <div className="relative h-90 w-full max-md:hidden image-container">
          <Image
            src={img2}
            alt="img1"
            fill
            className="absolute rounded-2xl shadow-lg"
          />
        </div>
        <div className="relative h-90 w-full max-lg:hidden image-container">
          <Image
            src={img3}
            alt="img1"
            fill
            className="absolute rounded-2xl shadow-lg "
          />
        </div>
      </div>
      <div ref={contentRef} className="max-w-3xl m-auto my-15">
        <h1 className="text-2xl md:text-4xl font-semibold content-heading">
          We're here to create meaningful solutions that help businesses,
          communities, and individuals thrive in a rapidly changing environment.
        </h1>
        <p className="text-muted-foreground md:text-lg mt-3 content-text">
          Founded with a passion for innovation and a commitment to excellence,
          we began as a small team driven by curiosity and ambition. Over the
          years, we've grown into a trusted name by blending creativity,
          strategy, and technology to deliver impactful results. Our journey is
          built on a simple principle: always put people first.
        </p>
      </div>
      <div ref={cardsRef} className="flex-center max-lg:flex-col gap-10">
        <div className="bg-card text-card-foreground p-5 rounded-2xl shadow-md max-w-sm border card-item">
          <h1 className="text-lg font-semibold mb-1">Our Vision</h1>
          <p className="text-muted-foreground">
            To lead innovation globally, empowering people and businesses to
            create lasting impact and solutions meaningful growth.
          </p>
        </div>
        <div className="bg-card text-card-foreground p-5 rounded-2xl shadow-md max-w-sm border card-item">
          <h1 className="text-lg font-semibold mb-1">Our Mission</h1>
          <p className="text-muted-foreground">
            We provide people-focused strategies and that spark change, foster
            success,and drive industries forward.
          </p>
        </div>
      </div>
      <OurTeams />
    </div>
  );
};

export default About;
