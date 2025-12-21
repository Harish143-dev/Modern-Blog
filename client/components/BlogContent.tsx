"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extensions";
import { TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextEditorMenus from "./TextEditorMenus";
import { useEffect } from "react";

interface TiptapProps {
  initialContent?: string;
  onUpdate?: (html: string) => void;
}

const Tiptap = ({ initialContent = "", onUpdate }: TiptapProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Preserve spacing and formatting
        paragraph: {
          HTMLAttributes: {
            class: "my-3",
          },
        },
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
          HTMLAttributes: {
            class: "list-disc pl-6 my-4",
          },
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
          HTMLAttributes: {
            class: "list-decimal pl-6 my-4",
          },
        },
        listItem: {
          HTMLAttributes: {
            class: "my-2",
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class: "bg-slate-800 text-slate-100 p-4 rounded-lg my-4",
          },
        },
        code: {
          HTMLAttributes: {
            class: "bg-gray-100 text-pink-600 px-2 py-0.5 rounded",
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: "border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4",
          },
        },
        horizontalRule: {
          HTMLAttributes: {
            class: "border-gray-300 my-8",
          },
        },
      }),
      TextStyle,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline hover:text-blue-800",
        },
      }),
      Placeholder.configure({
        placeholder: "Start writing or paste content from anywhere...",
      }),
    ],
    content: initialContent || "<p></p>",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl max-w-none focus:outline-none p-6 min-h-[400px] prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-p:my-3 prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6 prose-li:my-2 prose-code:bg-gray-100 prose-code:text-pink-600 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-slate-800 prose-pre:text-slate-100 prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 prose-hr:border-gray-300 prose-strong:font-bold prose-em:italic",
      },
      // Handle pasted content
      transformPastedHTML(html) {
        // Clean up common issues from Word/Google Docs
        return (
          html
            // Remove Word/Office namespace tags
            .replace(/<o:p>/gi, "")
            .replace(/<\/o:p>/gi, "")
            // Remove MS Word specific tags
            .replace(/<\/?w:[^>]*>/gi, "")
            .replace(/<\/?m:[^>]*>/gi, "")
            // Remove inline styles that might break formatting
            .replace(/style="[^"]*"/gi, "")
            // Remove font tags
            .replace(/<\/?font[^>]*>/gi, "")
            // Remove span tags that might carry unwanted styling
            .replace(/<span[^>]*>/gi, "")
            .replace(/<\/span>/gi, "")
            // Clean up excessive whitespace
            .replace(/&nbsp;/gi, " ")
            // Remove empty paragraphs
            .replace(/<p>\s*<\/p>/gi, "")
            // Preserve line breaks
            .replace(/<br\s*\/?>/gi, "<br />")
        );
      },
      transformPastedText(text) {
        // Handle plain text paste - preserve line breaks
        return text
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0)
          .join("\n\n");
      },
    },
    onUpdate: ({ editor }) => {
      if (onUpdate) {
        onUpdate(editor.getHTML());
      }
    },
  });

  // Update editor when initialContent changes
  useEffect(() => {
    if (editor && initialContent && editor.getHTML() !== initialContent) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  if (!editor) return null;

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-muted-foreground mb-2">
        Content *
      </label>
      <div className="border border-gray-300 relative rounded-lg shadow-sm bg-background">
        <div className="sticky top-17 z-10 bg-card rounded-lg">
          <TextEditorMenus editor={editor} />
        </div>
        <div className="bg-background ">
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Helper text */}
      <div className="mt-2 flex justify-between text-xs text-gray-500">
        <span>Text Editor</span>
        <div className="flex gap-3">
          <span>
            {editor.state.doc.textContent.split(/\s+/).filter(Boolean).length}{" "}
            words
          </span>
          <span>{editor.state.doc.textContent.length} characters</span>
        </div>
      </div>
    </div>
  );
};

export default Tiptap;
