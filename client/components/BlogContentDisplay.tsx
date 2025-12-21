"use client";

import DOMPurify from 'dompurify';

interface BlogContentDisplayProps {
  content: string;
  className?: string;
}

const BlogContentDisplay = ({ content, className = "" }: BlogContentDisplayProps) => {
  // Sanitize HTML to prevent XSS attacks
  const sanitizedContent = DOMPurify.sanitize(content);

  return (
    <div
      className={`
        prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl max-w-none
        prose-headings:font-bold prose-headings:text-gray-900
        prose-h1:text-4xl prose-h1:mb-4
        prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-3
        prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-2
        prose-p:text-gray-700 prose-p:leading-relaxed prose-p:my-4
        prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800
        prose-strong:text-gray-900 prose-strong:font-bold
        prose-em:italic
        prose-code:bg-gray-100 prose-code:text-pink-600 prose-code:px-2 prose-code:py-0.5 
        prose-code:rounded prose-code:text-sm
        prose-code:before:content-none prose-code:after:content-none
        prose-pre:bg-slate-800 prose-pre:text-slate-100 prose-pre:p-4 
        prose-pre:rounded-lg prose-pre:overflow-x-auto
        prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4
        prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4
        prose-li:my-2 prose-li:text-gray-700
        prose-blockquote:border-l-4 prose-blockquote:border-blue-500 
        prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
        prose-hr:border-gray-300 prose-hr:my-8
        prose-img:rounded-lg prose-img:shadow-md
        ${className}
      `}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

export default BlogContentDisplay;
