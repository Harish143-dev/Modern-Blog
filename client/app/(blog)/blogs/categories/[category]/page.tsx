import BlogCard from "@/components/BlogCard";
import { blogService } from "@/services/blog.service";

export default async function CategoryPage({ params }: any) {
  const resolvedParams = await params; // FIX
  const category = resolvedParams.category; // NOW SAFE

  if (!category) {
    return (
      <div className="p-10 text-center text-red-500">Invalid category</div>
    );
  }

  let data;
  try {
    data = await blogService.getBlogByCategory(category);
  } catch (err) {
    return (
      <div className="p-10 flex-center min-h-screen">
        <h1 className="text-lg md:text-2xl font-bold text-primary">
          <span className="text-4xl md:text-7xl font-bold text-secondary">
            Oops!
          </span>{" "}
          No blogs found in this category.
        </h1>
      </div>
    );
  }
  return (
    <div className="px-4 md:px-14 py-8 pt-20 m-auto">
      <h1 className="text-2xl md:text-4xl font-bold mb-8">
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {data.blogs.map((blog: any) => (
          <BlogCard key={blog._id} blogs={blog} />
        ))}
      </div>
    </div>
  );
}
