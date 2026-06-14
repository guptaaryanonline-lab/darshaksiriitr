import { SiteHeader } from "@/components/site-header";
import { getPublicationPage } from "@/lib/content";
import Link from "next/link";
import { BookOpen, ExternalLink } from "lucide-react";

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

      <section className="section-shell pt-8 pb-12">
        <div className="max-w-3xl">
          <p className="eyebrow">Research Output</p>
          <h1 className="mt-3 text-4xl font-semibold text-ink sm:text-5xl">Publications</h1>
          <p className="mt-6 leading-8 text-slate-700">
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
            className="mt-6 inline-block text-navy hover:text-ink font-semibold"
          >
            View Google Scholar Profile →
          </a>
        </div>
      </section>

      {/* Filters */}
      <section className="section-shell pb-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-slate-600 uppercase mb-3">Year</p>
              <div className="flex flex-wrap gap-2">
                <a
                  href="/publications"
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    !data.year
                      ? "bg-blue-600 text-white"
                      : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  All
                </a>
                {data.yearOptions.map((y) => (
                  <a
                    key={y}
                    href={getFilterUrl("year", String(y))}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      data.year === String(y)
                        ? "bg-blue-600 text-white"
                        : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {y}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-600 uppercase mb-3">Type</p>
              <div className="flex flex-wrap gap-2">
                <a
                  href={data.year ? `/publications?year=${data.year}` : "/publications"}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    !data.type || data.type === "All"
                      ? "bg-blue-600 text-white"
                      : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  All
                </a>
                {data.typeOptions.map((t) => (
                  <a
                    key={t}
                    href={getFilterUrl("type", t)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      data.type === t
                        ? "bg-blue-600 text-white"
                        : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {t}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Publications by Year */}
      <section className="section-shell pb-16">
        {filteredPublications.length > 0 ? (
          <div className="space-y-12">
            {Array.from(new Set(filteredPublications.map((p) => p.year)))
              .sort((a, b) => b - a)
              .map((year) => {
                const pubsInYear = filteredPublications.filter((p) => p.year === year);
                return (
                  <div key={year}>
                    <h2 className="text-2xl font-semibold text-slate-700 mb-6">{year}</h2>
                    <div className="space-y-4">
                      {pubsInYear.map((pub, idx) => {
                        const baseIndex =
                          filteredPublications.findIndex((p) => p.id === pub.id);
                        return (
                          <article key={pub.id} className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition">
                            <div className="flex gap-6">
                              <div className="flex-shrink-0">
                                <p className="text-2xl font-bold text-navy">{String(baseIndex + 1).padStart(2, "0")}</p>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="inline-block rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                    {pub.type}
                                  </span>
                                  <span className="text-sm font-medium text-slate-600">{pub.year}</span>
                                </div>
                                <h3 className="text-lg font-semibold text-ink leading-tight">{pub.title}</h3>
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
                                {pub.doi && (
                                  <a
                                    href={`https://doi.org/${pub.doi}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-ink transition"
                                  >
                                    DOI: {pub.doi}
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                )}
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
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <p className="text-slate-600">No publications found matching your filters.</p>
          </div>
        )}
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
        <p>© 2026 Dr. Darshak Bhatt. RISHI Lab, IIT Roorkee.</p>
      </footer>
    </main>
  );
}
