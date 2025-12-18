"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { blogService } from "@/services/blog.service";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { BlogType } from "@/types/blogsType";

export default function UpdateBlogPage({
  initialData: initialBlog,
}: {
  initialData: BlogType;
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: initialBlog.title || "",
    slug: initialBlog.slug || "",
    content: initialBlog.content || "",
    description: initialBlog.description || "",
    category: initialBlog.category || "",
    tags: initialBlog.tags ? initialBlog.tags.join(",") : "",
    published: initialBlog.published || false,
  });
  const [images, setImages] = useState<File | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string>("");
  const [existingImage, setExistingImage] = useState<string>(
    initialBlog.blogImages || ""
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const formRef = useRef(null);
  const fieldsRef = useRef<HTMLDivElement>(null);

  // Check authentication
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
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    const file = files[0]; // Take only the first file

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Only JPG, PNG and WEBP images are allowed");
      return;
    }

    setImages(file);
    setPreviewUrls(URL.createObjectURL(file));
    setError("");
  };

  const removeNewImage = () => {
    setImages(null);
    setPreviewUrls("");
  };

  const removeExistingImage = () => {
    setExistingImage("");
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await blogService.deleteBlog(initialBlog._id);

      // Success animation
      gsap.to(formRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          router.push("/dashboard/blogs");
        },
      });
    } catch (err: any) {
      console.error("Delete blog error:", err);
      setError(err.response?.data?.message || "Failed to delete blog");
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
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

      const updateData = {
        ...formData,
        tags: tagsArray,
        blogImage: existingImage, // Single image string
      };

      console.log("Sending update request:", {
        blogId: initialBlog._id,
        data: updateData,
        hasNewImage: images,
      });

      const result = await blogService.updateBlog(
        initialBlog._id,
        updateData,
        images || undefined
      );

      console.log("Blog updated successfully:", result);

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
      console.error("Update blog error:", err);

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
        setError(err.response?.data?.message || "Failed to update blog");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="mx-auto px-4 pt-20 max-w-4xl">
      <div ref={headerRef} className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Update Blog Post</h1>
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
              URL-friendly version of the title
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

          {/* Existing Image */}
          {existingImage && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Current Image
              </label>
              <div className="relative group w-full max-w-md">
                <div className="relative h-48 w-full">
                  <Image
                    src={existingImage}
                    alt="Current blog image"
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={removeExistingImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* New Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              {existingImage ? "Replace Image" : "Upload Image"}
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

            {previewUrls && (
              <div className="mt-4 relative group w-full max-w-md">
                <div className="relative h-48 w-full">
                  <Image
                    src={previewUrls}
                    alt="New image preview"
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={removeNewImage}
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
              Published (uncheck to save as draft)
            </label>
          </div>
        </div>

        {/* Submit Buttons */}
        {/* Submit Buttons */}
        <div className="flex gap-4 pt-4 border-t">
          <button
            onClick={handleSubmit}
            disabled={loading || isDeleting}
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
                Updating...
              </span>
            ) : (
              "Update Blog Post"
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            disabled={loading || isDeleting}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            disabled={loading || isDeleting}
            className="px-6 py-3 border rounded-lg hover:bg-secondary hover:text-secondary-foreground transition disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => !isDeleting && setShowDeleteModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-600 dark:text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Delete Blog
                </h3>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete "{formData.title}"? This action
              cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isDeleting ? (
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
                    Deleting...
                  </span>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
