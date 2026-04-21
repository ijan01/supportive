"use client";

import { useState } from "react";

export function FeaturedSubscribeButton({ plan }: { plan: "monthly" | "annual" }) {
  const [loading, setLoading] = useState(false);

  const priceId = plan === "monthly"
    ? process.env.NEXT_PUBLIC_STRIPE_FEATURED_MONTHLY_PRICE_ID
    : process.env.NEXT_PUBLIC_STRIPE_FEATURED_ANNUAL_PRICE_ID;

  const label = plan === "monthly" ? "Get featured — $49/month" : "Annual plan — $399/year (save $189)";

  async function handleClick() {
    if (!priceId) {
      alert("Stripe price not configured. Contact support.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/payments/featured-subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price_id: priceId }),
    });
    const data = await res.json();
    if (res.ok && data.url) {
      window.location.href = data.url;
    } else {
      alert(data.error || "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all disabled:opacity-50 ${
        plan === "monthly"
          ? "bg-violet-600 text-white hover:bg-violet-700"
          : "border border-violet-300 text-violet-700 hover:bg-violet-100"
      }`}
    >
      {loading ? "Redirecting..." : label}
    </button>
  );
}

export function FeaturedManageButton() {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const res = await fetch("/api/payments/portal", { method: "POST" });
    const data = await res.json();
    if (res.ok && data.url) {
      window.location.href = data.url;
    } else {
      alert(data.error || "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <button onClick={handleClick} disabled={loading} className="px-4 py-2 rounded-full border border-amber-300 text-amber-800 text-sm font-medium hover:bg-amber-100 transition-all disabled:opacity-50">
      {loading ? "Opening..." : "Manage subscription"}
    </button>
  );
}
