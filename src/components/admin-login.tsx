"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin12345");
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
    <main className="grid min-h-screen place-items-center bg-slate-100 px-5 py-10">
      <form onSubmit={submit} className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-soft">
        <div className="mb-8 flex items-center gap-4">
          <Image src="/images/RISHI_LAB.png" alt="RISHI Lab" width={76} height={76} className="h-16 w-16 object-contain" />
          <div>
            <h1 className="text-2xl font-semibold text-ink">Admin Panel</h1>
            <p className="mt-1 text-sm text-slate-600">Manage site content from one place.</p>
          </div>
        </div>
        <label className="block text-sm font-semibold text-slate-700" htmlFor="email">Email</label>
        <input
          id="email"
          className="focus-ring mt-2 w-full rounded-md border border-slate-300 px-3 py-2"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          autoComplete="email"
        />
        <label className="mt-5 block text-sm font-semibold text-slate-700" htmlFor="password">Password</label>
        <input
          id="password"
          className="focus-ring mt-2 w-full rounded-md border border-slate-300 px-3 py-2"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          autoComplete="current-password"
        />
        {error ? <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p> : null}
        <button disabled={loading} className="mt-6 w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}
