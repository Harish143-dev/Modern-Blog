import mongoose, { Schema, Document } from "mongoose";

export interface IBlogComment extends Document {
  blogId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  comment: string;
  createdAt: Date;
}
const blogCommentSchema: Schema<IBlogComment> = new Schema(
  {
    blogId: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);
const BlogComment = mongoose.model<IBlogComment>(
  "BlogComment",
  blogCommentSchema
);

export default BlogComment;
