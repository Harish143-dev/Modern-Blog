"use client";

import { CATEGORIES, NAV_LINKS } from "@/constant";
import Link from "next/link";
import React, { useRef } from "react";
import {
  FaAngleRight,
  FaInstagram,
  FaFacebookF,
  FaXTwitter,
} from "react-icons/fa6";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const quickLinksRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
          end: "top 60%",
          toggleActions: "play none none reverse",
        },
      });

      // Animate brand section
      tl.from(brandRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: "power3.out",
      });

      // Animate social icons with stagger
      tl.from(
        socialRef.current?.children || [],
        {
          opacity: 0,
          scale: 0,
          duration: 0.4,
          stagger: 0.1,
          ease: "back.out(2)",
        },
        "-=0.4"
      );

      // Animate quick links
      tl.from(
        quickLinksRef.current,
        {
          opacity: 0,
          x: -30,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.5"
      );

      // Animate categories
      tl.from(
        categoriesRef.current,
        {
          opacity: 0,
          x: -30,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.5"
      );

      // Animate bottom section
      tl.from(
        bottomRef.current,
        {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.3"
      );

      // Hover effects for social icons
      const socialIcons = socialRef.current?.querySelectorAll("a");
      socialIcons?.forEach((icon) => {
        icon.addEventListener("mouseenter", () => {
          gsap.to(icon, {
            scale: 1.2,
            rotation: 5,
            duration: 0.3,
            ease: "back.out(2)",
          });
        });

        icon.addEventListener("mouseleave", () => {
          gsap.to(icon, {
            scale: 1,
            rotation: 0,
            duration: 0.3,
            ease: "power2.out",
          });
        });
      });

      // Hover effects for links
      const allLinks = footerRef.current?.querySelectorAll(
        ".footer-link"
      );
      allLinks?.forEach((link) => {
        link.addEventListener("mouseenter", () => {
          gsap.to(link, {
            x: 5,
            duration: 0.3,
            ease: "power2.out",
          });
        });

        link.addEventListener("mouseleave", () => {
          gsap.to(link, {
            x: 0,
            duration: 0.3,
            ease: "power2.out",
          });
        });
      });
    },
    { scope: footerRef }
  );

  return (
    <div
      ref={footerRef}
      className="bg-card text-card-foreground px-5 md:px-10 lg:px-16 py-8 md:py-10 mt-10 border shadow-md w-full"
    >
      {/* Main Content */}
      <div className="w-full flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-12">
        {/* Brand Section */}
        <div ref={brandRef} className="w-full lg:max-w-md">
          <h1 className="text-2xl md:text-3xl font-bold">Modern Blogs</h1>
          <p className="text-muted-foreground mt-3 text-sm md:text-base leading-relaxed">
            Delivering independent journalism, thought-provoking insights, and
            trustworthy reporting to keep you informed, inspired, and engaged
            with the world every day.
          </p>
          <div
            ref={socialRef}
            className="flex items-center gap-4 mt-6"
          >
            <Link
              href="#"
              className="hover:text-primary transition-colors duration-300"
              aria-label="Instagram"
            >
              <FaInstagram className="text-xl md:text-2xl" />
            </Link>
            <Link
              href="#"
              className="hover:text-primary transition-colors duration-300"
              aria-label="Facebook"
            >
              <FaFacebookF className="text-xl md:text-2xl" />
            </Link>
            <Link
              href="#"
              className="hover:text-primary transition-colors duration-300"
              aria-label="Twitter"
            >
              <FaXTwitter className="text-xl md:text-2xl" />
            </Link>
          </div>
        </div>

        {/* Links Section */}
        <div className="flex flex-col sm:flex-row justify-start lg:justify-center items-start gap-8 sm:gap-12 lg:gap-20 w-full lg:w-auto">
          {/* Quick Links */}
          <div ref={quickLinksRef}>
            <h2 className="text-lg md:text-xl font-semibold mb-4">
              Quick Link
            </h2>
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  className="footer-link text-sm md:text-base text-muted-foreground hover:text-foreground transition-colors duration-300"
                  href={link.href}
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div ref={categoriesRef}>
            <h2 className="text-lg md:text-xl font-semibold mb-4">
              Categories
            </h2>
            <div className="flex flex-col gap-2">
              {CATEGORIES.map((link) => (
                <Link
                  key={link.id}
                  className="footer-link text-sm md:text-base text-muted-foreground hover:text-foreground transition-colors duration-300"
                  href={link.href}
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div
        ref={bottomRef}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full mt-8 pt-6 border-t border-border text-xs md:text-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
          <p className="text-muted-foreground">
            © 2023 Modern Blog. All rights reserved.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href="/privacy-policy"
              className="flex items-center gap-2 hover:text-primary transition-colors duration-300"
            >
              Privacy Policy
              <FaAngleRight className="text-xs" />
            </Link>
            <Link
              href="/terms-of-service"
              className="flex items-center gap-2 hover:text-primary transition-colors duration-300"
            >
              Terms of Service
              <FaAngleRight className="text-xs" />
            </Link>
          </div>
        </div>
        <div>
          <p className="text-muted-foreground">Created by Harish</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;