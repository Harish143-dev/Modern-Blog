import { blogService } from "@/services/blog.service";
import HighestViewsBlogs from "./HighestViewsBlogs";
import TodayHighlight from "./TodayHighlight";
import LatestBlog from "./LatestBlog";
import BlogsSlider from "./BlogsSlider";
import CategoriesPage from "@/app/(blog)/blogs/categories/page";
import Categories from "./Categories";
import BlogCard from "./BlogCard";

export async function HighestViewsBlogsAsync() {
  const data = await blogService.getAllBlogs();
  return <HighestViewsBlogs blogs={data.blogs} />;
}
export async function BlogSliderAsync() {
  const data = await blogService.getAllBlogs();
  return <BlogsSlider blogs={data.blogs} />;
}

export async function TodayHighlightAsync() {
  const data = await blogService.getAllBlogs();
  return <TodayHighlight blogs={data.blogs} />;
}

export async function CategoriesAsync() {
  const data = await blogService.getAllBlogs();
  return (
    <Categories
      heading="Categories"
      para="Explore a wide range of topics and interests through our diverse categories."
    />
  );
}

export async function LatestBlogAsync() {
  const data = await blogService.getAllBlogs();
  return <LatestBlog blogs={data.blogs} />;
}
export async function BlogCardAsync() {
  const data = await blogService.getAllBlogs();
  return <BlogCard blogs={data.blogs} />;
}
