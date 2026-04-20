"use client";

import { useState, useActionState } from "react";
import Link from "next/link";
import { registerAction } from "./actions";

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold hover:from-violet-700 hover:to-purple-700 transition-all disabled:opacity-50"
    >
      {pending ? "Creating account..." : "Create account"}
    </button>
  );
}

export default function RegisterPage() {
  const [role, setRole] = useState<"seeker" | "company">("seeker");
  const [state, formAction, isPending] = useActionState(registerAction, null);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-violet-50 to-purple-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Create account</h1>
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
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">{state.error}</div>
          )}

          <form action={formAction} className="space-y-4">
            <input type="hidden" name="role" value={role} />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Your name</label>
              <input
                name="name"
                type="text"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            {role === "company" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company name</label>
                <input
                  name="companyName"
                  type="text"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                name="password"
                type="password"
                required
                minLength={6}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <p className="text-xs text-slate-400 mt-1">At least 6 characters</p>
            </div>
            <SubmitButton pending={isPending} />
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-violet-600 font-medium hover:text-violet-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
