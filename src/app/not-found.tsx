import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-5">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
          <Compass className="h-7 w-7 text-navy" />
        </div>
        <p className="eyebrow">404</p>
        <h1 className="mt-3 text-2xl font-semibold text-ink sm:text-3xl">Page not found</h1>
        <p className="mt-4 leading-7 text-slate-600">
          The page you’re looking for doesn’t exist or may have moved.
        </p>
        <div className="mt-8 flex justify-center">
          <Link href="/" className="btn-primary">
            Back to homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
