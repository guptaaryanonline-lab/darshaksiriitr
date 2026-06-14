"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const nav = [
  ["Home", "/"],
  ["Lab", "/lab"],
  ["Research", "/research"],
  ["Projects", "/projects"],
  ["Patents", "/patents"],
  ["Students", "/students"],
  ["Goals", "/goals"],
  ["Teaching", "/teaching"],
  ["Contact", "/contact"]
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const prev = document.body.style.overflow;
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = prev || "";
    }
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [menuOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-3 sm:px-8 lg:px-10">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/images/IIT_logo.png" alt="IIT Roorkee" width={46} height={46} className="h-11 w-11 object-contain" priority />
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-ink">Dr. Darshak Bhatt</p>
              <p className="hidden text-sm text-slate-600 sm:block">Associate Professor, ECE, IIT Roorkee</p>
            </div>
          </Link>
          <nav className="ml-auto hidden items-center gap-1 lg:flex">
            {nav.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                  isActive(href)
                    ? "bg-blue-600 text-white"
                    : "text-slate-700 hover:bg-slate-100 hover:text-ink"
                }`}
              >
                {label}
              </Link>
            ))}
         
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 lg:hidden"
          >
            {!menuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-700">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2.25 6C2.25 5.58579 2.58579 5.25 3 5.25H21C21.4142 5.25 21.75 5.58579 21.75 6C21.75 6.41421 21.4142 6.75 21 6.75H3C2.58579 6.75 2.25 6.41421 2.25 6Z"
                  fill="currentColor"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2.25 12C2.25 11.5858 2.58579 11.25 3 11.25H21C21.4142 11.25 21.75 11.5858 21.75 12C21.75 12.4142 21.4142 12.75 21 12.75H3C2.58579 12.75 2.25 12.4142 2.25 12Z"
                  fill="currentColor"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2.25 18C2.25 17.5858 2.58579 17.25 3 17.25H21C21.4142 17.25 21.75 17.5858 21.75 18C21.75 18.4142 21.4142 18.75 21 18.75H3C2.58579 18.75 2.25 18.4142 2.25 18Z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-700">
                <path d="M6 6L18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <nav className="absolute inset-0 z-10 flex flex-col gap-4 bg-white p-6 pt-5 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <span className="text-lg font-semibold text-ink">Menu</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
                aria-label="Close navigation menu"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 6L18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="mt-4 flex flex-col items-start gap-2">
              {nav.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`w-full rounded-xl px-4 py-4 text-lg font-medium transition ${
                    isActive(href)
                      ? "bg-blue-600 text-white"
                      : "text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  {label}
                </Link>
              ))}
              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-4 text-lg font-semibold text-white transition hover:bg-blue-700 text-center"
              >
                Admin
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
