"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight, common } from "lowlight";
import { useEffect, useCallback, useState, useRef } from "react";
import { marked } from "marked";

// ── Markdown detection ───────────────────────────────────────────────────────
function looksLikeMarkdown(text: string): boolean {
  const patterns = [
    /^#{1,6}\s+\S/m,          // headings: ## Title
    /\*\*[^*\n]+\*\*/,        // bold: **text**
    /\*[^*\n]+\*/,            // italic: *text*
    /^\s*[-*+]\s+\S/m,        // unordered list: - item
    /^\s*\d+\.\s+\S/m,        // ordered list: 1. item
    /`[^`\n]+`/,              // inline code: `code`
    /^```/m,                  // code block
    /^\s*>/m,                 // blockquote: > text
    /\[.+?\]\(.+?\)/,         // link: [text](url)
    /^---+\s*$/m,             // horizontal rule
  ];
  // Require at least 2 patterns to avoid false positives
  return patterns.filter((p) => p.test(text)).length >= 2;
}

// Clipboard HTML from real websites has semantic elements.
// Tiptap-generated clipboard HTML is just <p> wrappers — treat as plain text.
function hasRealHtmlFormatting(html: string): boolean {
  return /<(strong|b|em|i|h[1-6]|ul|ol|li|blockquote|pre|table)\b/i.test(html);
}
import MediaPicker from "./MediaPicker";

const lowlight = createLowlight(common);

interface RichEditorProps {
  value: string;          // markdown / HTML stored value
  onChange: (val: string) => void;
  label?: string;
  placeholder?: string;
}

// ── Toolbar button ────────────────────────────────────────────────────────────
function ToolBtn({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      disabled={disabled}
      title={title}
      className={`flex items-center justify-center w-8 h-8 rounded-md text-sm transition-colors ${
        active
          ? "bg-zinc-700 text-white"
          : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
      } ${disabled ? "opacity-30 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-zinc-700/60 mx-0.5" />;
}

// ── Icons ──────────────────────────────────────────────────────────────────────
const I = {
  Bold: () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>,
  Italic: () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5}><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>,
  Underline: () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>,
  Strike: () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}><path d="M17.3 6.69A7.26 7.26 0 0 0 12 5C8.69 5 6 7.24 6 10c0 1.64.78 3.1 2 4h8c1.22-.9 2-2.36 2-4"/><line x1="4" y1="14" x2="20" y2="14"/><path d="M6.8 19a7 7 0 0 0 5.2 2 7 7 0 0 0 5.2-2"/></svg>,
  H1: () => <span className="text-xs font-bold tracking-tight">H1</span>,
  H2: () => <span className="text-xs font-bold tracking-tight">H2</span>,
  H3: () => <span className="text-xs font-bold tracking-tight">H3</span>,
  Ul: () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></svg>,
  Ol: () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>,
  Quote: () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M3.691 6.292C5.094 4.771 7.217 4 10 4h1v2.819l-.804.161c-1.37.274-2.323.813-2.833 1.604A2.902 2.902 0 0 0 6.925 10H10a1 1 0 0 1 1 1v7c0 1.103-.897 2-2 2H3a1 1 0 0 1-1-1v-5l.003-2.919c-.009-.111-.199-2.741 1.688-4.789zM20 20h-6a1 1 0 0 1-1-1v-5l.003-2.919c-.009-.111-.199-2.741 1.688-4.789C16.094 4.771 18.217 4 21 4h1v2.819l-.804.161c-1.37.274-2.323.813-2.833 1.604A2.902 2.902 0 0 0 17.925 10H21a1 1 0 0 1 1 1v7c0 1.103-.897 2-2 2z"/></svg>,
  Code: () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  CodeBlock: () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="m10 9-3 3 3 3"/><path d="m14 9 3 3-3 3"/></svg>,
  Link: () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  Image: () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  AlignLeft: () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}><line x1="21" y1="6" x2="3" y2="6"/><line x1="15" y1="12" x2="3" y2="12"/><line x1="17" y1="18" x2="3" y2="18"/></svg>,
  AlignCenter: () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}><line x1="21" y1="6" x2="3" y2="6"/><line x1="17" y1="12" x2="7" y2="12"/><line x1="19" y1="18" x2="5" y2="18"/></svg>,
  AlignRight: () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="12" x2="9" y2="12"/><line x1="21" y1="18" x2="7" y2="18"/></svg>,
  Highlight: () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}><path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/></svg>,
  Undo: () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 7v6h6"/><path d="M3 13C4.5 8.5 9 5 13.5 5a9.5 9.5 0 0 1 9.5 9.5c0 5.25-4.25 9.5-9.5 9.5-3.25 0-6.1-1.61-7.83-4.07"/></svg>,
  Redo: () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 7v6h-6"/><path d="M21 13C19.5 8.5 15 5 10.5 5a9.5 9.5 0 0 0-9.5 9.5c0 5.25 4.25 9.5 9.5 9.5 3.25 0 6.1-1.61 7.83-4.07"/></svg>,
  Hr: () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}><line x1="3" y1="12" x2="21" y2="12"/></svg>,
};

export default function RichEditor({ value, onChange, label, placeholder }: RichEditorProps) {
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [showMdImport, setShowMdImport] = useState(false);
  const [mdImportText, setMdImportText] = useState("");

  const editorRef = useRef<ReturnType<typeof useEditor>>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({ multicolor: false }),
      Placeholder.configure({
        placeholder: placeholder ?? "Commencez à rédiger votre contenu…",
      }),
      CharacterCount,
      Link.configure({ openOnClick: false, autolink: true }),
      Image.configure({ inline: false }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "prose prose-invert prose-sm max-w-none outline-none min-h-[400px] px-5 py-4",
      },
    },
    onUpdate({ editor }) {
      const html = editor.getHTML();
      onChange(html === "<p></p>" ? "" : html);
      setWordCount(editor.storage.characterCount.words());
      setCharCount(editor.storage.characterCount.characters());
    },
    immediatelyRender: false,
  });

  // Keep ref in sync so paste handler can access the editor instance
  useEffect(() => {
    if (editor) (editorRef as React.MutableRefObject<typeof editor>).current = editor;
  }, [editor]);

  // ── Smart paste: Markdown → HTML ────────────────────────────────────────────
  useEffect(() => {
    if (!editor) return;
    editor.setOptions({
      editorProps: {
        ...editor.options.editorProps,
        handlePaste(_view, event) {
          const html = event.clipboardData?.getData("text/html") ?? "";
          const text = event.clipboardData?.getData("text/plain") ?? "";

          // If clipboard carries real HTML formatting (from a website), let
          // Tiptap handle it natively — it strips irrelevant styles cleanly.
          if (hasRealHtmlFormatting(html)) return false;

          // If plain text looks like Markdown, convert to HTML and insert.
          if (looksLikeMarkdown(text)) {
            event.preventDefault();
            const converted = marked.parse(text, { async: false }) as string;
            editorRef.current?.commands.insertContent(converted);
            return true;
          }

          return false; // default paste behaviour
        },
      },
    });
  }, [editor]);

  // ── Import Markdown panel ───────────────────────────────────────────────────
  const insertMarkdown = useCallback(() => {
    if (!mdImportText.trim() || !editor) return;
    const html = marked.parse(mdImportText, { async: false }) as string;
    editor.commands.insertContent(html);
    setMdImportText("");
    setShowMdImport(false);
  }, [editor, mdImportText]);

  // Sync external value changes (edit mode initial load)
  useEffect(() => {
    if (editor && value && editor.getHTML() !== value) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  const setLink = useCallback(() => {
    if (!linkUrl) {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor
        ?.chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
    }
    setLinkUrl("");
    setShowLinkInput(false);
  }, [editor, linkUrl]);

  const addImage = useCallback(() => setShowMediaPicker(true), []);

  const handleImagePick = useCallback(
    (url: string) => {
      if (url) editor?.chain().focus().setImage({ src: url }).run();
    },
    [editor]
  );

  if (!editor) return null;

  return (
    <div>
      {label && (
        <label className="block text-xs font-medium text-zinc-400 mb-1.5">{label}</label>
      )}

      <div className="border border-zinc-700/80 rounded-xl overflow-hidden bg-zinc-900/80 focus-within:border-zinc-600 transition-colors">
        {/* ── Toolbar ── */}
        <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-zinc-800/80 bg-zinc-900">
          {/* History */}
          <ToolBtn title="Annuler" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
            <I.Undo />
          </ToolBtn>
          <ToolBtn title="Rétablir" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
            <I.Redo />
          </ToolBtn>

          <Divider />

          {/* Headings */}
          <ToolBtn title="Titre 1" active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
            <I.H1 />
          </ToolBtn>
          <ToolBtn title="Titre 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
            <I.H2 />
          </ToolBtn>
          <ToolBtn title="Titre 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
            <I.H3 />
          </ToolBtn>

          <Divider />

          {/* Inline marks */}
          <ToolBtn title="Gras" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
            <I.Bold />
          </ToolBtn>
          <ToolBtn title="Italique" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
            <I.Italic />
          </ToolBtn>
          <ToolBtn title="Souligné" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
            <I.Underline />
          </ToolBtn>
          <ToolBtn title="Barré" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
            <I.Strike />
          </ToolBtn>
          <ToolBtn title="Surligner" active={editor.isActive("highlight")} onClick={() => editor.chain().focus().toggleHighlight().run()}>
            <I.Highlight />
          </ToolBtn>

          <Divider />

          {/* Alignment */}
          <ToolBtn title="Aligner à gauche" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
            <I.AlignLeft />
          </ToolBtn>
          <ToolBtn title="Centrer" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
            <I.AlignCenter />
          </ToolBtn>
          <ToolBtn title="Aligner à droite" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
            <I.AlignRight />
          </ToolBtn>

          <Divider />

          {/* Lists */}
          <ToolBtn title="Liste à puces" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
            <I.Ul />
          </ToolBtn>
          <ToolBtn title="Liste numérotée" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
            <I.Ol />
          </ToolBtn>
          <ToolBtn title="Citation" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
            <I.Quote />
          </ToolBtn>

          <Divider />

          {/* Code */}
          <ToolBtn title="Code inline" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
            <I.Code />
          </ToolBtn>
          <ToolBtn title="Bloc de code" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
            <I.CodeBlock />
          </ToolBtn>

          <Divider />

          {/* Link */}
          <ToolBtn title="Lien" active={editor.isActive("link")} onClick={() => {
            if (editor.isActive("link")) {
              editor.chain().focus().unsetLink().run();
            } else {
              setShowLinkInput((v) => !v);
            }
          }}>
            <I.Link />
          </ToolBtn>

          {/* Image */}
          <ToolBtn title="Image" onClick={addImage}>
            <I.Image />
          </ToolBtn>

          {/* HR */}
          <ToolBtn title="Séparateur" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
            <I.Hr />
          </ToolBtn>

          <Divider />

          {/* Markdown import */}
          <ToolBtn
            title="Importer du Markdown"
            active={showMdImport}
            onClick={() => setShowMdImport((v) => !v)}
          >
            <span className="text-[10px] font-bold tracking-tight font-mono">MD</span>
          </ToolBtn>
        </div>

        {/* Markdown import panel */}
        {showMdImport && (
          <div className="border-b border-zinc-800/80 bg-zinc-950/60 p-3 space-y-2">
            <p className="text-[11px] text-zinc-500 leading-snug">
              Colle ton contenu Markdown ou copié d&apos;un site web ici.
              Il sera converti automatiquement.
            </p>
            <textarea
              autoFocus
              value={mdImportText}
              onChange={(e) => setMdImportText(e.target.value)}
              rows={6}
              placeholder={"# Titre\n\n**Texte en gras**, *italique*...\n\n- item 1\n- item 2"}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-zinc-200 font-mono p-3 outline-none resize-y placeholder:text-zinc-600 focus:border-zinc-500 transition-colors"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={insertMarkdown}
                disabled={!mdImportText.trim()}
                className="text-xs bg-green-app/20 text-green-app hover:bg-green-app/30 disabled:opacity-40 px-3 py-1.5 rounded-md transition-colors font-medium"
              >
                Insérer dans l&apos;éditeur
              </button>
              <button
                type="button"
                onClick={() => { setShowMdImport(false); setMdImportText(""); }}
                className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                Annuler
              </button>
              <span className="text-[10px] text-zinc-700 ml-auto">
                Le contenu sera ajouté à la position du curseur
              </span>
            </div>
          </div>
        )}

        {/* Link input */}
        {showLinkInput && (
          <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-800/80 bg-zinc-950/60">
            <svg className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            <input
              autoFocus
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); setLink(); } if (e.key === "Escape") setShowLinkInput(false); }}
              placeholder="https://..."
              className="flex-1 bg-transparent text-sm text-zinc-200 outline-none placeholder:text-zinc-600"
            />
            <button
              type="button"
              onClick={setLink}
              className="text-xs bg-green-app/20 text-green-app hover:bg-green-app/30 px-2.5 py-1 rounded-md transition-colors"
            >
              Insérer
            </button>
            <button
              type="button"
              onClick={() => setShowLinkInput(false)}
              className="text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* ── Editor area ── */}
        <EditorContent editor={editor} />

        {/* ── Footer ── */}
        <div className="flex items-center justify-between px-5 py-2 border-t border-zinc-800/60 bg-zinc-950/40">
          <div className="flex items-center gap-4 text-xs text-zinc-600">
            <span>{wordCount} mot{wordCount !== 1 ? "s" : ""}</span>
            <span>{charCount} caractère{charCount !== 1 ? "s" : ""}</span>
          </div>
          <div className="text-xs text-zinc-700">
            ⌘B gras · ⌘I italic · ⌘K lien
          </div>
        </div>
      </div>

      {/* Prose styles */}
      <style>{`
        .tiptap.ProseMirror {
          font-family: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
        }
        .tiptap.ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #52525b;
          pointer-events: none;
          height: 0;
        }
        .tiptap h1 { font-size: 1.875rem; font-weight: 700; margin: 1.25rem 0 0.75rem; color: #f4f4f5; }
        .tiptap h2 { font-size: 1.5rem; font-weight: 600; margin: 1rem 0 0.5rem; color: #e4e4e7; }
        .tiptap h3 { font-size: 1.25rem; font-weight: 600; margin: 0.875rem 0 0.5rem; color: #d4d4d8; }
        .tiptap p { margin: 0.5rem 0; color: #a1a1aa; line-height: 1.7; }
        .tiptap strong { color: #f4f4f5; font-weight: 600; }
        .tiptap em { color: #d4d4d8; font-style: italic; }
        .tiptap u { text-decoration-color: #52525b; }
        .tiptap mark { background: #fbbf2430; color: #fbbf24; border-radius: 2px; padding: 0 2px; }
        .tiptap a { color: #4ade80; text-decoration: underline; text-decoration-color: #4ade8060; }
        .tiptap a:hover { text-decoration-color: #4ade80; }
        .tiptap ul { list-style: disc; padding-left: 1.5rem; margin: 0.5rem 0; color: #a1a1aa; }
        .tiptap ol { list-style: decimal; padding-left: 1.5rem; margin: 0.5rem 0; color: #a1a1aa; }
        .tiptap li { margin: 0.25rem 0; }
        .tiptap blockquote { border-left: 3px solid #3f3f46; padding-left: 1rem; margin: 0.75rem 0; color: #71717a; font-style: italic; }
        .tiptap code { background: #27272a; color: #4ade80; padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-size: 0.875em; font-family: 'JetBrains Mono', 'Fira Code', monospace; }
        .tiptap pre { background: #18181b; border: 1px solid #27272a; border-radius: 0.5rem; padding: 1rem; margin: 0.75rem 0; overflow-x: auto; }
        .tiptap pre code { background: none; color: #e4e4e7; padding: 0; font-size: 0.875rem; }
        .tiptap hr { border: none; border-top: 1px solid #3f3f46; margin: 1.5rem 0; }
        .tiptap img { max-width: 100%; border-radius: 0.5rem; margin: 0.75rem 0; }
        .tiptap p.is-empty::before { color: #52525b; }
        .tiptap.ProseMirror-focused { outline: none; }
        /* Highlight.js theme — One Dark */
        .hljs-comment,.hljs-quote{color:#5c6370;font-style:italic}
        .hljs-doctag,.hljs-keyword,.hljs-formula{color:#c678dd}
        .hljs-section,.hljs-name,.hljs-selector-tag,.hljs-deletion,.hljs-subst{color:#e06c75}
        .hljs-literal{color:#56b6c2}
        .hljs-string,.hljs-regexp,.hljs-addition,.hljs-attribute,.hljs-meta-string{color:#98c379}
        .hljs-built_in,.hljs-class .hljs-title{color:#e6c07b}
        .hljs-attr,.hljs-variable,.hljs-template-variable,.hljs-type,.hljs-selector-class,.hljs-selector-attr,.hljs-selector-pseudo,.hljs-number{color:#d19a66}
        .hljs-symbol,.hljs-bullet,.hljs-link,.hljs-meta,.hljs-selector-id,.hljs-title{color:#61aeee}
        .hljs-emphasis{font-style:italic}
        .hljs-strong{font-weight:bold}
        .hljs-link{text-decoration:underline}
      `}</style>

      {/* Media picker for inline images */}
      <MediaPicker
        open={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSelect={handleImagePick}
      />
    </div>
  );
}
