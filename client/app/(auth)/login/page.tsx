"use client";

import { useState, useRef } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import ThemeSwitch from "@/components/ui/ThemeSwitch";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLDivElement>(null);
  const passwordRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("Please fill in all required fields");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      // Shake animation on error
      gsap.fromTo(
        formRef.current,
        { x: -10 },
        { x: 10, repeat: 3, yoyo: true, duration: 0.1, ease: "power2.inOut" }
      );
      gsap.to(formRef.current, { x: 0, delay: 0.4 });
      return;
    }

    setLoading(true);

    try {
      const { ...loginData } = formData;
      await authService.login(loginData);
      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // GSAP Animations
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Initial states
    gsap.set(
      [
        headingRef.current,
        subheadingRef.current,
        emailRef.current,
        passwordRef.current,
        buttonRef.current,
      ],
      {
        opacity: 0,
        y: 30,
      }
    );

    gsap.set(containerRef.current, {
      opacity: 0,
      scale: 0.9,
    });

    // Animation sequence
    tl.to(containerRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: "back.out(1.7)",
    })
      .to(
        headingRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
        },
        "-=0.3"
      )
      .to(
        subheadingRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
        },
        "-=0.3"
      )
      .to(
        emailRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
        },
        "-=0.2"
      )
      .to(
        passwordRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
        },
        "-=0.3"
      )
      .to(
        buttonRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
        },
        "-=0.3"
      );

    // Hover animations for input fields
    const inputs = [emailRef.current, passwordRef.current];
    inputs.forEach((input) => {
      if (input) {
        const inputElement = input.querySelector("input");
        if (inputElement) {
          const handleFocus = () => {
            gsap.to(input, {
              scale: 1.02,
              duration: 0.3,
              ease: "power2.out",
            });
          };

          const handleBlur = () => {
            gsap.to(input, {
              scale: 1,
              duration: 0.3,
              ease: "power2.out",
            });
          };

          inputElement.addEventListener("focus", handleFocus);
          inputElement.addEventListener("blur", handleBlur);
        }
      }
    }, []);

    // Button hover animation
    if (buttonRef.current) {
      const handleMouseEnter = () => {
        gsap.to(buttonRef.current, {
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out",
        });
      };

      const handleMouseLeave = () => {
        gsap.to(buttonRef.current, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      };

      buttonRef.current.addEventListener("mouseenter", handleMouseEnter);
      buttonRef.current.addEventListener("mouseleave", handleMouseLeave);
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-primary via-background to-secondary">
      <div
        ref={containerRef}
        className="relative max-w-md w-full space-y-8 bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl"
      >
        <div className="absolute right-3 top-3">
          <ThemeSwitch />
        </div>
        <div>
          <h2
            ref={headingRef}
            className="text-center text-3xl font-bold text-foreground/80"
          >
            Sign in to your account
          </h2>
          <p
            ref={subheadingRef}
            className="mt-2 text-center text-sm text-foreground/60"
          >
            Create an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                toast.info("Navigate to signup");
                router.push("/register");
              }}
              className="text-secondary/80 font-semibold hover:text-secondary transition"
            >
              Sign up
            </a>
          </p>
        </div>

        <div className="mt-8 space-y-6" ref={formRef}>
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-800 px-4 py-3 rounded-lg backdrop-blur-sm">
              {error}
            </div>
          )}

          {/* Email */}
          <div ref={emailRef}>
            <label className="flex items-center text-sm font-semibold text-muted-foreground mb-2">
              <Mail className="w-4 h-4 mr-2 text-secondary" />
              Email Address *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 border rounded-lg shadow-sm placeholder-muted-foreground transition"
              placeholder="john@example.com"
            />
          </div>

          {/* Password */}
          <div ref={passwordRef}>
            <label className="flex items-center text-sm font-semibold text-muted-foreground mb-2">
              <Lock className="w-4 h-4 mr-2 text-secondary" />
              Password *
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPasswords ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-3 border rounded-lg shadow-sm placeholder-muted-foreground transition"
                placeholder="Minimum 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-300 transition"
              >
                {showPasswords ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            ref={buttonRef}
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 rounded-lg shadow-lg text-sm font-medium bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </div>
      </div>
    </div>
  );
}
