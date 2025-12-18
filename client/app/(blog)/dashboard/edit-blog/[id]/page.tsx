import UpdateBlogForm from "@/components/UpdateBlogForm";
import { blogService } from "@/services/blog.service";
import React from "react";

const UpdateBlog = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  let blog;
  try {
    const data = await blogService.getBlogById(id);
    blog = data.blog;
  } catch (error) {
    return <div>Error loading blog</div>;
  }

  return (
    <div>
      <UpdateBlogForm initialData={blog} />
    </div>
  );
};

export default UpdateBlog;
