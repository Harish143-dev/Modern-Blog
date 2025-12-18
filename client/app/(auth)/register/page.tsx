"use client";

import { useState, useRef } from "react";
import { Eye, EyeOff, Lock, Mail, User, FileText, Camera } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ThemeSwitch from "@/components/ui/ThemeSwitch";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    bio: "",
  });
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const profilePicRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const row3Ref = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }

      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        setError("Only JPG, PNG and WEBP images are allowed");
        return;
      }

      setProfilePic(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError("");
    }
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email");
      return false;
    }

    if (formData.bio && formData.bio.length > 250) {
      setError("Bio must be 250 characters or less");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
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
      const { confirmPassword, ...registerData } = formData;
      await authService.register(registerData, profilePic || undefined);
      toast.success("Register Successfully");
      router.push("/login?registered=true");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    gsap.set(
      [
        headingRef.current,
        subheadingRef.current,
        profilePicRef.current,
        row1Ref.current,
        row2Ref.current,
        row3Ref.current,
        bioRef.current,
        buttonRef.current,
      ],
      {
        opacity: 0,
        y: 30,
      }
    );

    gsap.set(containerRef.current, {
      opacity: 0,
      scale: 0.95,
    });

    tl.to(containerRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: "back.out(1.7)",
    })
      .to(headingRef.current, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
      .to(subheadingRef.current, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
      .to(profilePicRef.current, { opacity: 1, y: 0, duration: 0.5 }, "-=0.2")
      .to(row1Ref.current, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
      .to(row2Ref.current, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
      .to(row3Ref.current, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
      .to(bioRef.current, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
      .to(buttonRef.current, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3");

    const inputRefs = [row1Ref, row2Ref, row3Ref, bioRef];
    inputRefs.forEach((ref) => {
      if (ref.current) {
        const inputs = ref.current.querySelectorAll("input, textarea");
        inputs.forEach((input) => {
          input.addEventListener("focus", () => {
            gsap.to(ref.current, {
              scale: 1.02,
              duration: 0.3,
              ease: "power2.out",
            });
          });
          input.addEventListener("blur", () => {
            gsap.to(ref.current, {
              scale: 1,
              duration: 0.3,
              ease: "power2.out",
            });
          });
        });
      }
    });

    if (buttonRef.current) {
      buttonRef.current.addEventListener("mouseenter", () => {
        gsap.to(buttonRef.current, {
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out",
        });
      });
      buttonRef.current.addEventListener("mouseleave", () => {
        gsap.to(buttonRef.current, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      });
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-primary via-background to-secondary">
      <div
        ref={containerRef}
        className="relative max-w-3xl w-full space-y-8 bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl"
      >
        <div className="absolute right-10">
          <ThemeSwitch />
        </div>
        <div>
          <h2 ref={headingRef} className="text-center text-3xl font-bold ">
            Create your account
          </h2>
          <p
            ref={subheadingRef}
            className="mt-2 text-center text-sm text-muted-foreground"
          >
            Already have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                toast.info("Navigate to login");
                router.push("/login");
              }}
              className="text-secondary/80 font-semibold hover:text-seondary transition"
            >
              Sign in
            </a>
          </p>
        </div>

        <div className="mt-8 space-y-6" ref={formRef}>
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-800 px-4 py-3 rounded-lg backdrop-blur-sm">
              {error}
            </div>
          )}

          {/* Profile Picture */}
          <div ref={profilePicRef} className="flex flex-col items-center">
            <div className="relative w-24 h-24 mb-4">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-secondary"
                />
              ) : (
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center border-2 border-secondary">
                  <Camera className="text-primary-foreground text-2xl" />
                </div>
              )}
            </div>
            <label className="cursor-pointer bg-gradient-to-r from-secondary to-primary  px-6 py-2 rounded-lg hover:from-secondary/80 hover:to-primary/80 transition-all shadow-lg">
              <span>Upload Profile Picture</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <p className="text-xs text-muted-foreground mt-2">
              JPG, PNG or WEBP (Max 5MB)
            </p>
          </div>

          {/* Row 1: Name & Email */}
          <div ref={row1Ref} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-sm font-semibold text-muted-foreground mb-2">
                <User className="w-4 h-4 mr-2 text-secondary" />
                Full Name *
              </label>
              <input
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="block w-full px-4 py-3 border rounded-lg placeholder-muted-foreground"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="flex items-center text-sm font-semibold text-muted-foreground mb-2">
                <Mail className="w-4 h-4 mr-2 text-secondary" />
                Email Address *
              </label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full px-4 py-3 border rounded-lg placeholder-muted-foreground"
                placeholder="john@example.com"
              />
            </div>
          </div>

          {/* Row 2: Password & Confirm Password */}
          <div ref={row2Ref} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-sm font-semibold text-muted-foreground mb-2">
                <Lock className="w-4 h-4 mr-2 text-secondary" />
                Password *
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-white/10 border rounded-lg shadow-sm placeholder-muted-foreground"
                  placeholder="Minimum 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary/80 transition-all hover:text-secondary"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="flex items-center text-sm font-semibold text-muted-foreground mb-2">
                <Lock className="w-4 h-4 mr-2 text-secondary" />
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-white/10 rounded-lg shadow-sm border placeholder-muted-foreground"
                  placeholder="Re-enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary/80 transition-all hover:text-secondary"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Row 3: Bio */}
          <div ref={bioRef}>
            <label className="flex items-center text-sm font-semibold text-muted-foreground mb-2">
              <FileText className="w-4 h-4 mr-2 text-secondary" />
              Bio (Optional)
            </label>
            <textarea
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              maxLength={250}
              className="block w-full px-4 py-3 border bg-white/10 rounded-lg shadow-sm  placeholder-muted-foreground resize-none"
              placeholder="Tell us about yourself (max 250 characters)"
            />
            <p className="mt-1 text-xs text-muted-foreground text-right">
              {formData.bio.length}/250
            </p>
          </div>

          {/* Submit Button */}
          <button
            ref={buttonRef}
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg shadow-lg text-sm font-medium bg-gradient-to-r from-secondary to-primary hover:from-primary hover:to-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
}
