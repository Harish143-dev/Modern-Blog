import Image from "next/image";
import { notFound } from "next/navigation";
import { blogService } from "@/services/blog.service";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";
import FeatureBlogSlider from "@/components/FeatureBlogSlider";
import Link from "next/link";
import BlogContentDisplay from "@/components/BlogContentDisplay";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await blogService.getBlogBySlug(slug);
  const blog = data.blog;

  if (!data) {
    notFound();
  }
  return (
    <main className="px-4 md:px-14 pt-20">
      <div className="mb-5">
        <h1 className="text-2xl md:text-4xl font-bold max-w-3xl mb-3">
          {blog.title}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mb-3">
          {blog.description}
        </p>
        <div className="flex items-center gap-2 p-4">
          <div className="relative w-9 h-9 rounded-full bg-secondary text-secondary-foreground flex-center overflow-hidden ring-2 ring-border">
            {blog.author?.profilePic ? (
              <Image src={blog.author.profilePic} alt="profile" fill />
            ) : (
              blog.author?.name?.charAt(0).toUpperCase() ?? "U"
            )}
          </div>
          <span className="text-sm md:text-base">{blog.author?.name}</span>
        </div>

        {blog.blogImages && (
          <div className="relative h-130 w-full mb-5">
            <Image
              src={blog.blogImages}
              alt={blog.title}
              fill
              className="object-cover rounded-md"
            />
          </div>
        )}
      </div>
      <div className="flex flex-col lg:flex-row items-baseline justify-between gap-10 mt-20">
        <section className="w-full lg:w-3/4 p-5">
          <div className="flex-base gap-5 mb-5">
            <span className="text-sm left-2 top-2 rounded-md bg-secondary text-secondary-foreground px-2 py-1 ">
              {blog.category}
            </span>
            <span className="text-sm md:text-base">
              {new Date(blog.createdAt).toLocaleDateString()}
            </span>
            <span className="text-sm md:text-base">{blog.views} views</span>
          </div>

          <div>
        
          <BlogContentDisplay content={blog.content} />
          
          </div>
        </section>
        <section className="w-full lg:w-1/4">
          <div className="p-5 bg-card text-card-foreground rounded-lg">
            <Link
              href="/about"
              className="text-lg font-semibold mb-2 text-muted-foreground"
            >
              About
            </Link>
            <h1 className="text-xl font-bold mt-3">Modern Blogs</h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              Delivering independent journalism,thought-provoking insights, and
              trustworthy reporting to keep you informed, inspired, and engaged
              with the world every day.
            </p>
            <div className="flex-base gap-4 mt-5">
              <FaInstagram size={20} className="cursor-pointer" />
              <FaFacebookF size={20} className="cursor-pointer" />
              <FaXTwitter size={20} className="cursor-pointer" />
            </div>
          </div>
          <div className="mt-10">
            <FeatureBlogSlider />
          </div>
        </section>
      </div>
    </main>
  );
}
