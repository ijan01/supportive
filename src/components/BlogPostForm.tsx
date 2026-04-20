"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

interface BlogPostFormProps {
  mode: "create" | "edit";
  initialData?: {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    author: string;
    published: boolean;
  };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

interface ToolbarAction {
  label: string;
  icon: string;
  prefix: string;
  suffix: string;
  block?: boolean;
}

const TOOLBAR_ACTIONS: ToolbarAction[] = [
  { label: "Bold", icon: "B", prefix: "**", suffix: "**" },
  { label: "Italic", icon: "I", prefix: "_", suffix: "_" },
  { label: "Heading 2", icon: "H2", prefix: "## ", suffix: "", block: true },
  { label: "Heading 3", icon: "H3", prefix: "### ", suffix: "", block: true },
  { label: "Bullet list", icon: "UL", prefix: "- ", suffix: "", block: true },
  { label: "Numbered list", icon: "OL", prefix: "1. ", suffix: "", block: true },
  { label: "Quote", icon: "Q", prefix: "> ", suffix: "", block: true },
  { label: "Link", icon: "Link", prefix: "[", suffix: "](url)" },
];

export default function BlogPostForm({ mode, initialData }: BlogPostFormProps) {
  const router = useRouter();
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [author, setAuthor] = useState(initialData?.author || "");
  const [published, setPublished] = useState(initialData?.published ?? false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [autoSlug, setAutoSlug] = useState(!initialData);
  const [showPreview, setShowPreview] = useState(false);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (autoSlug) setSlug(slugify(value));
  }

  const applyFormatting = useCallback((action: ToolbarAction) => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.slice(start, end);

    let newText: string;
    let cursorPos: number;

    if (action.block) {
      const lineStart = text.lastIndexOf("\n", start - 1) + 1;
      const before = text.slice(0, lineStart);
      const after = text.slice(lineStart);
      newText = before + action.prefix + after;
      cursorPos = lineStart + action.prefix.length + (end - lineStart);
    } else {
      newText = text.slice(0, start) + action.prefix + selected + action.suffix + text.slice(end);
      cursorPos = selected ? start + action.prefix.length + selected.length + action.suffix.length : start + action.prefix.length;
    }

    setContent(newText);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = cursorPos;
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !slug || !content || !excerpt || !author) {
      setError("All fields are required");
      return;
    }
    setLoading(true);
    setError("");

    const body = {
      action: mode === "create" ? "create" : "update",
      id: initialData?.id,
      title,
      slug,
      content,
      excerpt,
      author,
      published,
    };

    const res = await fetch("/api/admin/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to save");
      setLoading(false);
      return;
    }

    router.push("/admin/blog");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
        <div className="flex gap-2 items-center">
          <span className="text-slate-400 text-sm">/blog/</span>
          <input
            type="text"
            required
            value={slug}
            onChange={(e) => { setSlug(e.target.value); setAutoSlug(false); }}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Excerpt</label>
        <textarea
          required
          rows={2}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Short summary shown in blog cards and meta descriptions"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none text-sm"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-medium text-slate-700">Content</label>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="text-xs font-medium text-violet-600 hover:text-violet-700"
          >
            {showPreview ? "Edit" : "Preview"}
          </button>
        </div>

        {!showPreview ? (
          <>
            {/* Toolbar */}
            <div className="flex flex-wrap gap-1 mb-2 p-1.5 bg-slate-50 rounded-xl border border-slate-200">
              {TOOLBAR_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => applyFormatting(action)}
                  title={action.label}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-white hover:text-violet-600 hover:shadow-sm transition-all ${
                    action.icon === "B" ? "font-bold" : action.icon === "I" ? "italic" : ""
                  }`}
                >
                  {action.icon}
                </button>
              ))}
            </div>
            <textarea
              ref={contentRef}
              required
              rows={20}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-y font-mono text-sm leading-relaxed"
            />
          </>
        ) : (
          <div className="min-h-[400px] p-6 rounded-xl border border-slate-200 bg-white prose prose-slate max-w-none">
            <ContentPreview content={content} />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Author</label>
        <input
          type="text"
          required
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
        />
      </div>

      <div className="flex items-center gap-3">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-violet-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
        </label>
        <span className="text-sm font-medium text-slate-700">
          {published ? "Published" : "Draft"}
        </span>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 rounded-full bg-violet-600 text-white font-semibold hover:bg-violet-700 transition-all disabled:opacity-50"
        >
          {loading ? "Saving..." : mode === "create" ? "Create post" : "Update post"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 rounded-full border-2 border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function ContentPreview({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("### ")) {
      elements.push(<h3 key={i} className="text-lg font-bold text-slate-900 mt-6 mb-2">{line.slice(4)}</h3>);
    } else if (line.startsWith("## ")) {
      elements.push(<h2 key={i} className="text-xl font-bold text-slate-900 mt-8 mb-3">{line.slice(3)}</h2>);
    } else if (line.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <blockquote key={`q${i}`} className="border-l-4 border-violet-300 pl-4 my-4 text-slate-500 italic">
          {quoteLines.join("\n")}
        </blockquote>
      );
      continue;
    } else if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul${i}`} className="list-disc pl-6 my-3 space-y-1 text-slate-600">
          {items.map((item, j) => <li key={j}><InlineFormat text={item} /></li>)}
        </ul>
      );
      continue;
    } else if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      elements.push(
        <ol key={`ol${i}`} className="list-decimal pl-6 my-3 space-y-1 text-slate-600">
          {items.map((item, j) => <li key={j}><InlineFormat text={item} /></li>)}
        </ol>
      );
      continue;
    } else if (line.trim() === "") {
      // skip blank lines
    } else {
      elements.push(<p key={i} className="text-slate-600 leading-relaxed mb-4"><InlineFormat text={line} /></p>);
    }
    i++;
  }

  return <>{elements}</>;
}

function InlineFormat({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|_[^_]+_|\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("_") && part.endsWith("_")) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (linkMatch) {
          return <a key={i} href={linkMatch[2]} className="text-violet-600 underline hover:text-violet-700">{linkMatch[1]}</a>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
