import { Response } from "express";
import Blog from "../models/blog.model";
import { uploadTocloudinary } from "../services/cloudinary.service";
import { AuthRequest } from "../types/authRequest";

// -------------------------- CREATE BLOG --------------------------
export const createBlog = async (req: AuthRequest, res: Response) => {
  try {
    const { title, slug, content, description, tags, category, published } =
      req.body;
    const userId = req.user?.userId;

    // Validate authenticated userc
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Validate required fields
    if (!title || !content || !description || !category) {
      return res.status(400).json({
        message: "Title, content, description, and category are required",
      });
    }

    // Check if slug already exists
    if (slug) {
      const existingBlog = await Blog.findOne({ slug });
      if (existingBlog) {
        return res.status(409).json({ message: "Slug already exists" });
      }
    }

    let uploadedImages = "";

    if (req.file) {
      try {
        const result = (await uploadTocloudinary(req.file.buffer, "blogs")) as {
          secure_url: string;
        };
        uploadedImages = result.secure_url;
      } catch (uploadError) {
        console.error("Image upload failed:", uploadError);
        return res.status(500).json({
          message: "Failed to upload blog images",
        });
      }
    }

    // Create blog
    const blog = await Blog.create({
      title,
      slug:
        slug ||
        title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]/g, ""),
      content,
      description,
      author: userId, // Use 'author' from your model, not 'userId'
      blogImages: uploadedImages,
      tags: tags || [],
      category,
      published: published || false,
    });

    // Populate author info
    await blog.populate("author", "name profilePic");

    res.status(201).json({
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    console.error("Create blog error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while creating the blog" });
  }
};

// -------------------------- GET ALL BLOGS --------------------------
export const getAllBlogs = async (req: AuthRequest, res: Response) => {
  try {
    const { published, category, author, page = 1, limit = 10 } = req.query;

    // Build query filters
    const query: any = {};

    if (published !== undefined) {
      query.published = published === "true";
    }

    if (category) {
      query.category = category;
    }

    if (author) {
      query.author = author;
    }

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Get total count
    const total = await Blog.countDocuments(query);

    // Fetch blogs with pagination
    const blogs = await Blog.find(query)
      .populate("author", "name profilePic")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      message: "Blogs retrieved successfully",
      blogs,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Get all blogs error:", error);
    res.status(500).json({ message: "An error occurred while fetching blogs" });
  }
};

// -------------------------- GET BLOG BY ID --------------------------
export const getBlogById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id).populate(
      "author",
      "name profilePic bio"
    );

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Increment view count
    blog.views += 1;
    await blog.save();

    res.status(200).json({
      message: "Blog retrieved successfully",
      blog,
    });
  } catch (error) {
    console.error("Get blog error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the blog" });
  }
};

// -------------------------- GET BLOG BY SLUG --------------------------
export const getBlogBySlug = async (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({ slug }).populate(
      "author",
      "name profilePic bio"
    );

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Increment view count
    blog.views += 1;
    await blog.save();

    res.status(200).json({
      message: "Blog retrieved successfully",
      blog,
    });
  } catch (error) {
    console.error("Get blog by slug error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the blog" });
  }
};
// -------------------------- GET BLOG BY CATEGORY --------------------------
export const getBlogsByCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { category } = req.params;

    // Find ALL blogs with this category
    const blogs = await Blog.find({
      category: { $regex: new RegExp(`^${category}$`, "i") },
      published: true,
    })
      .populate("author", "name profilePic bio")
      .sort({ createdAt: -1 }); // Sort by newest first

    if (!blogs || blogs.length === 0) {
      return res.status(404).json({
        message: "No blogs found in this category",
        category,
      });
    }

    res.status(200).json({
      message: "Blogs retrieved successfully",
      count: blogs.length,
      category,
      blogs,
    });
  } catch (error) {
    console.error("Get blogs by category error:", error);
    res.status(500).json({
      message: "An error occurred while fetching blogs",
    });
  }
};

// Get all unique categories
export const getAllCategories = async (req: AuthRequest, res: Response) => {
  try {
    const categories = await Blog.distinct("category", {
      status: "published",
    });

    // Get count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await Blog.countDocuments({
          category,
          status: "published",
        });
        return {
          category,
          slug: category.toLowerCase().replace(/\s+/g, "-"),
          count,
        };
      })
    );

    res.status(200).json({
      message: "Categories retrieved successfully",
      categories: categoriesWithCount,
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({
      message: "An error occurred while fetching categories",
    });
  }
};

// Get single blog by category and slug (if needed)
export const getBlogByCategoryAndSlug = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { category, slug } = req.params;

    const blog = await Blog.findOne({
      category: category.toLowerCase(),
      slug: slug.toLowerCase(),
    }).populate("author", "name profilePic bio");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Increment view count
    blog.views += 1;
    await blog.save();

    res.status(200).json({
      message: "Blog retrieved successfully",
      blog,
    });
  } catch (error) {
    console.error("Get blog by category and slug error:", error);
    res.status(500).json({
      message: "An error occurred while fetching the blog",
    });
  }
};

// -------------------------- UPDATE BLOG --------------------------
export const updateBlog = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const { title, slug, content, description, tags, category, published } =
      req.body;

    // Validate authenticated user
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find existing blog
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Check if user is the author
    if (blog.author.toString() !== userId) {
      return res.status(403).json({
        message: "You are not authorized to update this blog",
      });
    }

    // Check if new slug already exists (if slug is being changed)
    if (slug && slug !== blog.slug) {
      const existingBlog = await Blog.findOne({ slug });
      if (existingBlog) {
        return res.status(409).json({ message: "Slug already exists" });
      }
    }

    // Handle new image uploads

    let uploadedImage = "";

    if (req.file) {
      try {
        const result = (await uploadTocloudinary(req.file.buffer, "blogs")) as {
          secure_url: string;
        };
        uploadedImage = result.secure_url;
      } catch (uploadError) {
        console.error("Image upload failed:", uploadError);
        return res.status(500).json({
          message: "Failed to upload blog images",
        });
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (title) updateData.title = title;
    if (slug) updateData.slug = slug;
    if (content) updateData.content = content;
    if (description) updateData.description = description;
    if (tags) updateData.tags = tags;
    if (category) updateData.category = category;
    if (published !== undefined) updateData.published = published;
    if (uploadedImage) updateData.blogImages = uploadedImage;

    // Update blog
    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("author", "name profilePic");

    res.status(200).json({
      message: "Blog updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("Update blog error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the blog" });
  }
};

// -------------------------- DELETE BLOG --------------------------
export const deleteBlog = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    // Validate authenticated user
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find blog
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Check if user is the author
    if (blog.author.toString() !== userId) {
      return res.status(403).json({
        message: "You are not authorized to delete this blog",
      });
    }

    // Delete blog
    await Blog.findByIdAndDelete(id);

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Delete blog error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the blog" });
  }
};

// -------------------------- GET USER'S BLOGS --------------------------
export const getUserBlogs = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const blogs = await Blog.find({ author: userId })
      .populate("author", "name profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "User blogs retrieved successfully",
      blogs,
    });
  } catch (error) {
    console.error("Get user blogs error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching user blogs" });
  }
};
