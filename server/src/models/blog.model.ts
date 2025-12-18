import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  description: string;
  author: mongoose.Types.ObjectId | any;
  blogImages?: string;
  tags?: string[];
  category: string;
  views: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema: Schema<IBlog> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    description: { type: String, required: true, maxLength: 300 },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    blogImages: { type: String },
    tags: [{ type: String }],
    category: { type: String, required: true },
    views: { type: Number, default: 0 },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Blog = mongoose.model<IBlog>("Blog", blogSchema);

export default Blog;
