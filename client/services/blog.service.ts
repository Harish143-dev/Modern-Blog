import api from "@/lib/api";

export interface BlogData {
  title: string;
  slug?: string;
  content: string;
  description: string;
  category: string;
  tags?: string[];
  published?: boolean;
}

export const blogService = {
  // Get all blogs
  getAllBlogs: async (params?: {
    published?: boolean;
    category?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get("/blogs", { params });
    return response.data;
  },

  // Get blog by ID
  getBlogById: async (id: string) => {
    const response = await api.get(`/blogs/${id}`);
    return response.data;
  },

  // Get blog by slug
  getBlogBySlug: async (slug: string) => {
    const response = await api.get(`/blogs/slug/${slug}`);
    return response.data;
  },
  // Get blogs by category
  getBlogByCategory: async (category: string) => {
    console.log("CATEGORY FRONTEND:", category);
    const response = await api.get(`/blogs/categories/${category}`);
    console.log("API RESPONSE:", response.data);
    return response.data;
  },

  // Create blog
  createBlog: async (data: BlogData, image?: File) => {
    const formData = new FormData();

    formData.append("title", data.title);
    if (data.slug) formData.append("slug", data.slug);
    formData.append("content", data.content);
    formData.append("description", data.description);
    formData.append("category", data.category);

    if (data.tags && Array.isArray(data.tags)) {
      data.tags.forEach((tag) => formData.append("tags", tag));
    }

    if (data.published !== undefined) {
      formData.append("published", String(data.published));
    }

    if (image) {
      formData.append("blogImages", image);
    }

    const response = await api.post("/blogs/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  },

  // Update blog
  updateBlog: async (id: string, data: Partial<BlogData>, image?: File) => {
    const formData = new FormData();

    // Append tags individually
    if (data.tags && Array.isArray(data.tags)) {
      data.tags.forEach((tag) => formData.append("tags", tag));
    }

    // Append other fields
    if (data.title) formData.append("title", data.title);
    if (data.slug) formData.append("slug", data.slug);
    if (data.content) formData.append("content", data.content);
    if (data.description) formData.append("description", data.description);
    if (data.category) formData.append("category", data.category);

    if (data.published !== undefined) {
      formData.append("published", String(data.published));
    }

    // Append new image if provided
    if (image) {
      formData.append("blogImages", image);
    }

    const response = await api.put(`/blogs/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  },

  // Delete blog
  deleteBlog: async (id: string) => {
    const response = await api.delete(`/blogs/${id}`);
    return response.data;
  },

  // Get user's blogs
  getUserBlogs: async () => {
    const response = await api.get("/blogs/user");
    return response.data;
  },
};
