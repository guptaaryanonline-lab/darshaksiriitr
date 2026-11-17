import { SiteHeader } from "@/components/site-header";
import { getPublicationPage } from "@/lib/content";
import Link from "next/link";
import Image from "next/image";
import { imageFitClass, imageFrameBg } from "@/lib/image-fit";
import { BookOpen, ExternalLink, FileText, Presentation } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Publications | Dr. Darshak Bhatt | RISHI Lab",
  description: "Research publications and papers from RISHI Lab and Dr. Darshak Bhatt."
};

export default async function PublicationsPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const data = await getPublicationPage(searchParams);

  const filteredPublications = data.publications.filter((pub) => {
    let matches = true;
    if (data.year && pub.year !== Number(data.year)) matches = false;
    if (data.type && data.type !== "All" && pub.type !== data.type) matches = false;
    return matches;
  });

  const getFilterUrl = (key: string, value: string) => {
    const params = new URLSearchParams();
    if (key === "year" && value !== "All") params.set("year", value);
    if (key === "type" && value !== "All") params.set("type", value);
    if (data.year && key !== "year") params.set("year", data.year);
    if (data.type && key !== "type" && data.type !== "All") params.set("type", data.type);
    return `/publications?${params.toString()}`;
  };

  return (
    <main>
      <SiteHeader />

      <section className="section-shell pt-8">
        <div className="max-w-3xl">
          <p className="eyebrow">Research Output</p>
          <h1 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">Publications</h1>
          <p className="mt-4 leading-7 text-slate-700">
            My research has been published in prestigious IEEE journals and international conferences, focusing on RF/analog integrated
            circuit design and wireless communication systems.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <div>
              <span className="font-semibold text-navy">Total Publications:</span>{" "}
              <span className="text-slate-700">{data.publications.length}+</span>
            </div>
            <div>
              <span className="font-semibold text-navy">IEEE Journals:</span>{" "}
              <span className="text-slate-700">{data.publications.filter((p) => p.type === "Journal").length}</span>
            </div>
            <div>
              <span className="font-semibold text-navy">Conference Papers:</span>{" "}
              <span className="text-slate-700">{data.publications.filter((p) => p.type === "Conference").length}+</span>
            </div>
          </div>
          <a
            href="https://scholar.google.com/citations?hl=en&user=XOKWdPAAAAAJ"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block cursor-pointer font-semibold text-navy transition duration-150 hover:text-ink"
          >
            View Google Scholar Profile →
          </a>
        </div>

        {/* Filters */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500 sm:mb-3">Year</p>
              <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden">
                <Link
                  scroll={false}
                  href="/publications"
                  className={`shrink-0 cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition duration-150 ${
                    !data.year
                      ? "bg-navy text-white"
                      : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  All
                </Link>
                {data.yearOptions.map((y) => (
                  <Link
                  scroll={false}
                    key={y}
                    href={getFilterUrl("year", String(y))}
                    className={`shrink-0 cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition duration-150 ${
                      data.year === String(y)
                        ? "bg-navy text-white"
                        : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {y}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500 sm:mb-3">Type</p>
              <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden">
                <Link
                  scroll={false}
                  href={data.year ? `/publications?year=${data.year}` : "/publications"}
                  className={`shrink-0 cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition duration-150 ${
                    !data.type || data.type === "All"
                      ? "bg-navy text-white"
                      : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  All
                </Link>
                {data.typeOptions.map((t) => (
                  <Link
                  scroll={false}
                    key={t}
                    href={getFilterUrl("type", t)}
                    className={`shrink-0 cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition duration-150 ${
                      data.type === t
                        ? "bg-navy text-white"
                        : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {t}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Publications by Year */}
        <div className="mt-8">
        {filteredPublications.length > 0 ? (
          <div className="space-y-10 sm:space-y-12">
            {Array.from(new Set(filteredPublications.map((p) => p.year)))
              .sort((a, b) => b - a)
              .map((year) => {
                const pubsInYear = filteredPublications.filter((p) => p.year === year);
                return (
                  <div key={year}>
                    <h2 className="mb-4 text-xl font-semibold text-slate-700 sm:mb-6 sm:text-2xl">{year}</h2>
                    <div className="space-y-4">
                      {pubsInYear.map((pub, idx) => {
                        const baseIndex =
                          filteredPublications.findIndex((p) => p.id === pub.id);
                        return (
                          <article key={pub.id} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-md">
                            <div className="grid lg:grid-cols-[0.4fr_0.6fr]">
                              {pub.image ? (
                              <div className={`relative aspect-[16/9] overflow-hidden lg:aspect-auto lg:min-h-64 ${imageFrameBg(pub.image)}`}>
                                {(
                                  <Image
                                    src={pub.image}
                                    alt={pub.title}
                                    fill
                                    sizes="(min-width: 1024px) 45vw, 100vw"
                                    className={`${imageFitClass(pub.image)} transition duration-500 group-hover:scale-105`}
                                  />
                                )}
                              </div>
                              ) : (
                                <PublicationCover type={pub.type} year={pub.year} venue={pub.type === "Journal" ? pub.journal : pub.conference} />
                              )}
                            <div className="flex gap-6 p-5 sm:p-8">
                              <div className="hidden flex-shrink-0 sm:block">
                                <p className="text-2xl font-bold text-navy">{String(baseIndex + 1).padStart(2, "0")}</p>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                                  <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                    {pub.type}
                                  </span>
                                  <span className="text-sm font-medium text-slate-600">{pub.year}</span>
                                </div>
                                <h3 className="text-base font-semibold leading-snug text-ink sm:text-lg">{pub.title}</h3>
                                <p className="mt-2 text-sm text-slate-600">{pub.authors}</p>
                                <div className="mt-3 space-y-1">
                                  <p className="text-sm font-semibold text-navy">
                                    {pub.type === "Journal" ? pub.journal : pub.conference}
                                  </p>
                                  {pub.volume || pub.pages ? (
                                    <p className="text-sm text-slate-600">
                                      {pub.volume && <>vol. {pub.volume}</>}
                                      {pub.volume && pub.pages && ", "}
                                      {pub.pages && <>pp. {pub.pages}</>}
                                    </p>
                                  ) : null}
                                </div>
                                {pub.link && (
                                  <a
                                    href={pub.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-3 mr-4 inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-navy transition duration-150 hover:text-ink"
                                  >
                                    View paper
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                )}
                                {pub.doi && (
                                  <a
                                    href={`https://doi.org/${pub.doi}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-3 inline-flex max-w-full cursor-pointer items-center gap-2 text-sm font-semibold text-navy transition duration-150 hover:text-ink"
                                  >
                                    <span className="break-all">DOI: {pub.doi}</span>
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                )}
                              </div>
                            </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <p className="text-slate-600">No publications found matching your filters.</p>
          </div>
        )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-50 py-16">
        <div className="section-shell max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-ink">Publication Impact</h2>
          <p className="mt-4 leading-7 text-slate-700">
            Our research continues to advance the field of RF microelectronics with contributions to top-tier journals and
            international conferences.
          </p>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-500">
        <p>© {new Date().getFullYear()} Dr. Darshak Bhatt. RISHI Lab, IIT Roorkee.</p>
      </footer>
    </main>
  );
}

// Designed cover shown when a publication has no uploaded image, so every
// card keeps the same image-beside-text layout.
function PublicationCover({ type, year, venue }: { type: string; year: number; venue: string | null }) {
  const Icon = type === "Journal" ? BookOpen : Presentation;
  return (
    <div className="relative hidden min-h-64 flex-col justify-between overflow-hidden bg-gradient-to-br from-navy via-navy to-teal p-6 text-white lg:flex">
      <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="relative flex items-center justify-between">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur">
          <Icon className="h-3.5 w-3.5" />
          {type}
        </span>
        <span className="text-sm font-semibold tabular-nums text-white/80">{year}</span>
      </div>
      <div className="relative">
        <FileText className="mb-3 h-8 w-8 text-white/70 sm:h-10 sm:w-10" />
        {venue && <p className="line-clamp-2 text-sm font-medium leading-snug text-white/90 sm:text-base">{venue}</p>}
      </div>
    </div>
  );
}
