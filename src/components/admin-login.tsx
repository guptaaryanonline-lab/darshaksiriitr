"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Lock, Mail } from "lucide-react";

export function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    setLoading(false);
    if (!response.ok) {
      setError("Login failed. Check the email and password.");
      return;
    }
    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-5 py-10">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
        <div className="mb-8 flex items-center gap-4">
          <Image src="/images/RISHI_LAB.png" alt="RISHI Lab" width={76} height={76} className="h-14 w-14 object-contain sm:h-16 sm:w-16" />
          <div>
            <h1 className="text-xl font-semibold text-ink sm:text-2xl">Admin panel</h1>
            <p className="mt-1 text-sm text-slate-500">Manage site content from one place.</p>
          </div>
        </div>

        <label className="block text-sm font-semibold text-slate-700" htmlFor="email">
          Email
        </label>
        <div className="relative mt-2">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="email"
            className="focus-ring w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
          />
        </div>

        <label className="mt-5 block text-sm font-semibold text-slate-700" htmlFor="password">
          Password
        </label>
        <div className="relative mt-2">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="password"
            className="focus-ring w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
          />
        </div>

        {error ? <p className="mt-4 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">{error}</p> : null}

        <button
          disabled={loading}
          className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-navy px-4 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-ink active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}
