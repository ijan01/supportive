"use client";

import { Suspense, useState, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { registerAction } from "./actions";

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3 rounded-full bg-violet-600 text-white font-semibold hover:bg-violet-700 transition-all disabled:opacity-50"
    >
      {pending ? "Creating account..." : "Create account"}
    </button>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const [role, setRole] = useState<"seeker" | "company">("seeker");
  const [state, formAction, isPending] = useActionState(registerAction, null);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "";

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-lavender">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Create account</h1>
          <p className="text-slate-500 mb-6">Get started in under a minute</p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setRole("seeker")}
              className={`p-4 rounded-xl border-2 transition-all ${
                role === "seeker"
                  ? "border-violet-600 bg-violet-50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="font-semibold text-slate-900">Job seeker</div>
              <div className="text-xs text-slate-500 mt-1">Find opportunities</div>
            </button>
            <button
              type="button"
              onClick={() => setRole("company")}
              className={`p-4 rounded-xl border-2 transition-all ${
                role === "company"
                  ? "border-violet-600 bg-violet-50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="font-semibold text-slate-900">Employer</div>
              <div className="text-xs text-slate-500 mt-1">Post roles — free</div>
            </button>
          </div>

          {state?.error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm">{state.error}</div>
          )}

          <form action={formAction} className="space-y-4">
            <input type="hidden" name="role" value={role} />
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Your name</label>
              <input
                name="name"
                type="text"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
            {role === "company" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company name</label>
                <input
                  name="companyName"
                  type="text"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                name="password"
                type="password"
                required
                minLength={6}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
              <p className="text-xs text-slate-400 mt-1">At least 6 characters</p>
            </div>
            <SubmitButton pending={isPending} />
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link href={`/auth/login${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`} className="text-violet-600 font-medium hover:text-violet-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
