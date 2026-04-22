"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminBlogActions({ postId, slug, isPublished }: { postId: number; slug: string; isPublished: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this blog post permanently?")) return;
    setLoading(true);
    await fetch("/api/admin/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id: postId }),
    });
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex gap-2">
      <Link
        href={`/admin/blog/edit?id=${postId}`}
        className="px-2 py-1 rounded-lg text-xs font-medium text-violet-600 hover:bg-violet-50 transition-colors"
      >
        Edit
      </Link>
      {isPublished && (
        <Link
          href={`/blog/${slug}`}
          className="px-2 py-1 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          target="_blank"
        >
          View
        </Link>
      )}
      <button
        onClick={handleDelete}
        disabled={loading}
        className="px-2 py-1 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
