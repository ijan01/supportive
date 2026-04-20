"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function SuccessToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (searchParams.get("posted") === "1") {
      setShow(true);
      router.replace("/dashboard/company", { scroll: false });
      const timer = setTimeout(() => setShow(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

  if (!show) return null;

  return (
    <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm font-medium flex items-center justify-between">
      <span>Role posted successfully — it&apos;s now live on the site.</span>
      <button onClick={() => setShow(false)} className="text-green-600 hover:text-green-800 ml-4 shrink-0">
        Dismiss
      </button>
    </div>
  );
}
