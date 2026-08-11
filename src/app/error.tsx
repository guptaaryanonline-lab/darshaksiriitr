"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Keep a server-side trace of unexpected render/data errors so issues
    // in production can be diagnosed from `docker compose logs app`.
    console.error("Unhandled route error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-5">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle className="h-7 w-7 text-red-500" />
        </div>
        <p className="eyebrow">Something went wrong</p>
        <h1 className="mt-3 text-2xl font-semibold text-ink sm:text-3xl">We hit an unexpected error</h1>
        <p className="mt-4 leading-7 text-slate-600">
          This has been logged. Please try again, or head back to the homepage.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={reset} className="btn-primary">
            Try again
          </button>
          <Link href="/" className="btn-secondary">
            Back to homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
