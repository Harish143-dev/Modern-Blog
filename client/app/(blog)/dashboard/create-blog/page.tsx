"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { blogService } from "@/services/blog.service";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function CreateBlogPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    description: "",
    category: "",
    tags: "",
    published: false,
  });
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const formRef = useRef(null);
  const fieldsRef = useRef<HTMLDivElement>(null);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  // GSAP animations
  useGSAP(() => {
    if (fieldsRef.current) {
      const tl = gsap.timeline();

      tl.from(headerRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      })
        .from(
          formRef.current,
          {
            y: 20,
            opacity: 0,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.3"
        )
        .from(
          fieldsRef.current.children,
          {
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
          },
          "-=0.4"
        );
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Animate the changed field
    gsap.fromTo(
      e.target,
      {
        scale: 1.01,
        boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
      },
      {
        scale: 1,
        boxShadow: "0 0 0 0px rgba(59, 130, 246, 0)",
        duration: 0.4,
        ease: "power2.out",
      }
    );

    // Auto-generate slug from title
    if (name === "title" && !formData.slug) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Only JPG, PNG and WEBP images are allowed");
      return;
    }

    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError("");
  };

  const removeImage = () => {
    setImage(null);
    setPreviewUrl("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not logged in. Redirecting...");
      setTimeout(() => router.push("/login"), 2000);
      return;
    }

    if (
      !formData.title ||
      !formData.content ||
      !formData.description ||
      !formData.category
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);

    // Animate form
    gsap.to(formRef.current, {
      opacity: 0.7,
      scale: 0.98,
      duration: 0.2,
    });

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      const blogData = {
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        description: formData.description,
        category: formData.category,
        tags: tagsArray,
        published: formData.published,
      };

      console.log("Submitting blog with data:", {
        ...blogData,
        hasImage: !!image,
      });

      const result = await blogService.createBlog(blogData, image || undefined);

      console.log("Blog created successfully:", result);

      // Success animation
      gsap.to(formRef.current, {
        y: -10,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
          router.push("/dashboard/blogs");
        },
      });
    } catch (err: any) {
      console.error("Create blog error:", err);

      // Reset form animation
      gsap.to(formRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.2,
      });

      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        localStorage.removeItem("token");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setError(err.response?.data?.message || "Failed to create blog");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="mx-auto px-4 pt-20 max-w-4xl">
      <div ref={headerRef} className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Create New Blog Post</h1>
        <button
          onClick={() => router.back()}
          className="cursor-pointer text-primary hover:text-secondary transition"
        >
          ← Back
        </button>
      </div>

      <div
        ref={formRef}
        className="space-y-6 bg-card text-card-foreground p-6 rounded-lg shadow"
      >
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div ref={fieldsRef}>
          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter blog title"
            />
          </div>

          {/* Slug */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Slug (URL)
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="auto-generated-from-title"
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave empty to auto-generate from title
            </p>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Description * (Max 300 characters)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              maxLength={300}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Brief description for SEO"
            />
            <p className="text-xs text-gray-500 text-right mt-1">
              {formData.description.length}/300
            </p>
          </div>

          {/* Content */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Content *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={12}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
              placeholder="Write your blog content here (supports HTML)"
            />
          </div>

          {/* Category */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border bg-card text-card-foreground border-gray-300 rounded-lg"
            >
              <option value="">Select a category</option>
              <option value="Technology">Technology</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Travel">Travel</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Science">Science</option>
              <option value="Business">Business</option>
            </select>
          </div>

          {/* Tags */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="react, nodejs, javascript"
            />
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Blog Image
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <p className="text-xs text-muted-foreground mt-1">
              JPG, PNG or WEBP (Max 5MB)
            </p>

            {/* Image Preview */}
            {previewUrl && (
              <div className="mt-4 relative group w-full max-w-md">
                <div className="relative h-48 w-full">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          {/* Published Checkbox */}
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="published"
              name="published"
              checked={formData.published}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="published"
              className="ml-2 text-sm text-muted-foreground"
            >
              Publish immediately (uncheck to save as draft)
            </label>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-4 border-t">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary/70 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Creating...
              </span>
            ) : (
              "Create Blog Post"
            )}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            disabled={loading}
            className="px-6 py-3 border rounded-lg hover:bg-secondary hover:text-secondary-foreground transition disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
