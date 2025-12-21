"use client";

import type { Editor } from "@tiptap/react";
import { useEditorState } from "@tiptap/react";
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  Code, 
  RemoveFormatting,
  Pilcrow,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code2,
  Quote,
  Minus,
  CornerDownLeft,
  Undo2,
  Redo2
} from "lucide-react";

const TextEditorMenus = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;

  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor.isActive("bold"),
      canBold: ctx.editor.can().chain().toggleBold().run(),

      isItalic: ctx.editor.isActive("italic"),
      canItalic: ctx.editor.can().chain().toggleItalic().run(),

      isStrike: ctx.editor.isActive("strike"),
      canStrike: ctx.editor.can().chain().toggleStrike().run(),

      isCode: ctx.editor.isActive("code"),
      canCode: ctx.editor.can().chain().toggleCode().run(),

      canClearMarks: ctx.editor.can().chain().unsetAllMarks().run(),

      isParagraph: ctx.editor.isActive("paragraph"),

      isHeading1: ctx.editor.isActive("heading", { level: 1 }),
      isHeading2: ctx.editor.isActive("heading", { level: 2 }),
      isHeading3: ctx.editor.isActive("heading", { level: 3 }),

      isBulletList: ctx.editor.isActive("bulletList"),
      isOrderedList: ctx.editor.isActive("orderedList"),
      isCodeBlock: ctx.editor.isActive("codeBlock"),
      isBlockquote: ctx.editor.isActive("blockquote"),

      canUndo: ctx.editor.can().chain().undo().run(),
      canRedo: ctx.editor.can().chain().redo().run(),
    }),
  });

  const MenuButton = ({ 
    onClick, 
    disabled = false, 
    active = false, 
    children, 
    title 
  }: { 
    onClick: () => void; 
    disabled?: boolean; 
    active?: boolean; 
    children: React.ReactNode; 
    title: string;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        p-2 rounded hover:bg-primary/10 transition-colors
        disabled:opacity-30 disabled:cursor-not-allowed
        ${active ? 'bg-primary text-primary-foreground' : 'text-primary'}
        flex items-center justify-center
      `}
    >
      {children}
    </button>
  );

  return (
    <div className="border-b">
      <div className="flex flex-wrap gap-1 p-2">
        {/* Text Formatting */}
        <div className="flex gap-1 border-r pr-2">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editorState.canBold}
            active={editorState.isBold}
            title="Bold (Ctrl+B)"
          >
            <Bold size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editorState.canItalic}
            active={editorState.isItalic}
            title="Italic (Ctrl+I)"
          >
            <Italic size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editorState.canStrike}
            active={editorState.isStrike}
            title="Strikethrough"
          >
            <Strikethrough size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={!editorState.canCode}
            active={editorState.isCode}
            title="Inline Code"
          >
            <Code size={18} />
          </MenuButton>
        </div>

        {/* Clear Formatting */}
        <div className="flex gap-1 border-r  pr-2">
          <MenuButton
            onClick={() => editor.chain().focus().unsetAllMarks().run()}
            disabled={!editorState.canClearMarks}
            title="Clear Formatting"
          >
            <RemoveFormatting size={18} />
          </MenuButton>
        </div>

        {/* Paragraph & Headings */}
        <div className="flex gap-1 border-r  pr-2">
          <MenuButton
            onClick={() => editor.chain().focus().setParagraph().run()}
            active={editorState.isParagraph}
            title="Paragraph"
          >
            <Pilcrow size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            active={editorState.isHeading1}
            title="Heading 1"
          >
            <Heading1 size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editorState.isHeading2}
            title="Heading 2"
          >
            <Heading2 size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            active={editorState.isHeading3}
            title="Heading 3"
          >
            <Heading3 size={18} />
          </MenuButton>
        </div>

        {/* Lists */}
        <div className="flex gap-1 border-r  pr-2">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editorState.isBulletList}
            title="Bullet List"
          >
            <List size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editorState.isOrderedList}
            title="Numbered List"
          >
            <ListOrdered size={18} />
          </MenuButton>
        </div>

        {/* Blocks */}
        <div className="flex gap-1 border-r  pr-2">
          <MenuButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            active={editorState.isCodeBlock}
            title="Code Block"
          >
            <Code2 size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editorState.isBlockquote}
            title="Blockquote"
          >
            <Quote size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal Rule"
          >
            <Minus size={18} />
          </MenuButton>
        </div>

        {/* History */}
        <div className="flex gap-1">
          <MenuButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editorState.canUndo}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editorState.canRedo}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 size={18} />
          </MenuButton>
        </div>
      </div>
    </div>
  );
};

export default TextEditorMenus;