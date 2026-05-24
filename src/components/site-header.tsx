import Image from "next/image";
import Link from "next/link";

const nav = [
  ["Research", "#research"],
  ["Projects", "#projects"],
  ["Patents", "#patents"],
  ["Students", "#students"],
  ["Goals", "#goals"],
  ["Contact", "#contact"]
];

export function SiteHeader() {
  return (
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
            <a key={href} href={href} className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-ink">
              {label}
            </a>
          ))}
          <Link href="/admin" className="ml-2 rounded-md bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-ink">
            Admin
          </Link>
        </nav>
        <Image src="/images/logo_ECE.png" alt="ECE Department" width={52} height={52} className="ml-auto h-11 w-11 object-contain lg:ml-0" />
      </div>
      <nav className="flex gap-2 overflow-x-auto px-5 pb-3 sm:px-8 lg:hidden">
        {nav.map(([label, href]) => (
          <a key={href} href={href} className="whitespace-nowrap rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
            {label}
          </a>
        ))}
        <Link href="/admin" className="whitespace-nowrap rounded-md bg-navy px-3 py-2 text-sm font-semibold text-white">
          Admin
        </Link>
      </nav>
    </header>
  );
}
