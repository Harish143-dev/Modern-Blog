import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getUserBlogs,
  getBlogBySlug,
  getBlogsByCategory,
  getBlogByCategoryAndSlug,
  getAllCategories,
} from "../controllers/blog.controller";
import { Router } from "express";
import { upload } from "../middlewares/upload";
import { authMiddleware } from "../middlewares/auth";

const blogRouter = Router();

// IMPORTANT: Specific routes MUST come before dynamic routes (/:id)

// Public routes (no auth needed)
blogRouter.get("/", getAllBlogs);

// Auth-required routes with specific paths (BEFORE /:id)
blogRouter.get("/user", authMiddleware, getUserBlogs);
blogRouter.get("/slug/:slug", getBlogBySlug);

blogRouter.get("/categories", getAllCategories);

// Get all blogs by category
blogRouter.get("/categories/:category", getBlogsByCategory);

// Optional: Get specific blog by category and slug
blogRouter.get("/categories/:category/:slug", getBlogByCategoryAndSlug);

// Create blog (auth required)
blogRouter.post(
  "/create",
  authMiddleware,
  upload.single("blogImages"),
  createBlog
);

// Dynamic routes (MUST be at the end)
blogRouter.get("/:id", getBlogById);
blogRouter.put("/:id", authMiddleware, upload.single("blogImages"), updateBlog);
blogRouter.delete("/:id", authMiddleware, deleteBlog);

export default blogRouter;
