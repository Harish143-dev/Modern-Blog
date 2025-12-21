"use client";
import React, { useEffect, useState, useRef } from "react";
import { Button } from "./ui/button";
import { NAV_LINKS } from "@/constant";
import Link from "next/link";
import ThemeSwitch from "./ui/ThemeSwitch";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import Image from "next/image";
import { FaBars, FaX } from "react-icons/fa6";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

interface UserType {
  name: string;
  email?: string;
  profilePic?: string;
}

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileLinksRef = useRef<HTMLUListElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);

      if (token) {
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser.user);
        } catch (error) {
          console.error("Failed to get user:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkAuth();

    // Listen for storage changes (for multi-tab sync)
    window.addEventListener("storage", checkAuth);

    // Listen for scroll to enhance glass effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useGSAP(() => {
    if (isMenuOpen) {
      // Prevent body scroll
      document.body.style.overflow = "hidden";

      // Animate overlay
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      });

      // Animate mobile menu
      gsap.fromTo(
        mobileMenuRef.current,
        {
          x: "100%",
        },
        {
          x: "0%",
          duration: 0.4,
          ease: "power3.out",
        }
      );

      // Animate menu items with stagger
      const links = mobileLinksRef.current?.children;
      if (links) {
        gsap.fromTo(
          Array.from(links),
          {
            x: 50,
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.08,
            ease: "power2.out",
            delay: 0.2,
          }
        );
      }
    } else {
      // Restore body scroll
      document.body.style.overflow = "";

      // Animate out overlay
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      });

      // Animate out mobile menu
      gsap.to(mobileMenuRef.current, {
        x: "100%",
        duration: 0.3,
        ease: "power3.in",
      });
    }
  }, [isMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    setIsMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
          isScrolled ? "py-2" : "py-4"
        }`}
      >
        <div
          className={`mx-3 md:mx-6 px-4 md:px-6 py-3 rounded-2xl transition-all duration-300 ${
            isScrolled
              ? "bg-background/50 backdrop-blur-sm border-border/50 border shadow-lg shadow-black/5"
              : "bg-background/0 backdrop-blur-sm"
          }`}
        >
          <div className="flex justify-between items-center w-full">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <h1 className="text-xl font-semibold">Modern Blog</h1>
            </Link>

            {/* Navigation Links */}
            <ul className="hidden md:flex justify-center gap-1 items-center">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="relative px-4 py-2 transition-colors duration-200 rounded-lg group"
                  >
                    {link.title}
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300 group-hover:w-1/2" />
                  </Link>
                </li>
              ))}
            </ul>

            {/* Actions */}
            <div className="flex justify-center items-center gap-3">
              <ThemeSwitch />

              {isLoggedIn && user ? (
                <>
                  {/* User Avatar/Menu */}
                  <Link href="/dashboard" className="hidden sm:block">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground/5 border border-border/50">
                      <div className="relative w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-white text-xs font-semibold">
                        {user.profilePic ? (
                          <Image
                            src={user.profilePic}
                            alt={user.name}
                            fill
                            className="rounded-full object-cover"
                          />
                        ) : (
                          user.name?.charAt(0).toUpperCase()
                        )}
                      </div>
                      <span className="text-sm">{user.name}</span>
                    </div>
                  </Link>

                  <Button
                    onClick={handleLogout}
                    className="hidden sm:flex relative overflow-hidden group bg-red-500/30 text-red-500 hover:bg-red-500 hover:text-red-50 border-0 shadow-lg transition-all duration-300"
                  >
                    <span className="relative z-10">Logout</span>
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/register" className="hidden sm:block">
                    <Button className="text-secondary bg-secondary/30 hover:bg-secondary hover:text-secondary-foreground transition-colors">
                      Register
                    </Button>
                  </Link>

                  <Link href="/login" className="hidden sm:block">
                    <Button className="relative overflow-hidden bg-primary/30 text-primary hover:bg-primary hover:text-primary-foreground border-0 shadow-lg transition-all duration-300 hover:scale-105">
                      <span className="relative z-10">Login</span>
                    </Button>
                  </Link>
                </>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 hover:bg-foreground/5 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <FaX className="w-4 h-4" />
                ) : (
                  <FaBars className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] opacity-0 pointer-events-none md:hidden"
        style={{ pointerEvents: isMenuOpen ? "auto" : "none" }}
        onClick={closeMobileMenu}
      />

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-background border-l border-border shadow-2xl z-[70] md:hidden translate-x-full"
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex justify-between items-center p-6 border-b border-border">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button
              onClick={closeMobileMenu}
              className="p-2 hover:bg-foreground/5 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <FaX className="w-3 h-3" />
            </button>
          </div>

          {/* User Info */}
          {isLoggedIn && user && (
            <div className="p-6 border-b border-border">
              <Link href="/dashboard" onClick={closeMobileMenu}>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-foreground/5 border border-border/50 hover:bg-foreground/10 transition-colors">
                  <div className="relative w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white text-sm font-semibold">
                    {user.profilePic ? (
                      <Image
                        src={user.profilePic}
                        alt={user.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    ) : (
                      user.name?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">{user.name}</span>
                    {user.email && (
                      <span className="text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Mobile Navigation Links */}
          <ul
            ref={mobileLinksRef}
            className="flex-1 overflow-y-auto p-6 space-y-2"
          >
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 rounded-lg hover:bg-foreground/5 transition-colors text-base font-medium"
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Footer */}
          <div className="p-6 border-t border-border space-y-3">
            {isLoggedIn ? (
              <Button
                onClick={handleLogout}
                className="w-full bg-red-500/30 text-red-500 hover:bg-red-500 hover:text-red-50 transition-all duration-300"
              >
                Logout
              </Button>
            ) : (
              <>
                <Link href="/login" onClick={closeMobileMenu}>
                  <Button className="w-full mb-3 bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground shadow-lg hover:scale-105 transition-all duration-300">
                    Login
                  </Button>
                </Link>
                <Link href="/register" onClick={closeMobileMenu}>
                  <Button className="w-full bg-secondary/20 text-secondary hover:bg-secondary hover:text-secondary-foreground transition-colors">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
