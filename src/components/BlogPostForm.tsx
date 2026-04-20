"use client";

import { useState } from "react";
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

export default function BlogPostForm({ mode, initialData }: BlogPostFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [author, setAuthor] = useState(initialData?.author || "");
  const [published, setPublished] = useState(initialData?.published ?? false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [autoSlug, setAutoSlug] = useState(!initialData);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (autoSlug) setSlug(slugify(value));
  }

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
        <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
        <p className="text-xs text-slate-400 mb-2">Use ## for headings. Plain text with line breaks.</p>
        <textarea
          required
          rows={20}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-y font-mono text-sm"
        />
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
