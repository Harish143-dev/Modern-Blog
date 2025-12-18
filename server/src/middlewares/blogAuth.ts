import Blog from "../models/blog.model";
import { Request, Response, NextFunction } from "express";

export const verifyBlogOwner = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // FIX: Use userId instead of id
    if (blog.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    next();
  } catch (error) {
    console.error("Verify blog owner error:", error);
    res.status(500).json({ message: "Server error" });
  }
};