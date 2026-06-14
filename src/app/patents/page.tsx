import { SiteHeader } from "@/components/site-header";
import { SearchFilter } from "@/components/search-filter";
import { Pagination } from "@/components/pagination";
import { getPatentPage } from "@/lib/content";
import { FileText, ExternalLink } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Patents | Dr. Darshak Bhatt | RISHI Lab",
  description: "Explore intellectual property and patents from RISHI Lab research."
};

export default async function PatentsPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const data = await getPatentPage(searchParams);

  return (
    <main>
      <SiteHeader />

      <section className="section-shell pt-8">
        <div className="mb-8 max-w-3xl">
          <p className="eyebrow">Intellectual Property</p>
          <h1 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">Patents & Inventions</h1>
          <p className="mt-4 leading-7 text-slate-700">
            Intellectual property developed through RISHI Lab research covering RF circuits, wireless systems, and quantum technologies.
          </p>
        </div>

        <SearchFilter
          pageUrl="/patents"
          placeholder="Search by title or inventors..."
          sortOptions={[
            { label: "Year (Newest)", value: "year" },
            { label: "Status", value: "status" }
          ]}
        />

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {data.patents.length > 0 ? (
            data.patents.map((patent, idx) => (
              <article key={patent.id} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-slate-300 sm:p-6 flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-slate-100 p-2">
                      <FileText className="h-5 w-5 text-navy" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase">Patent</p>
                      <p className="text-lg font-bold text-navy">{patent.year}</p>
                    </div>
                  </div>
                  <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {patent.status}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-ink leading-tight">{patent.title}</h3>
                <p className="mt-2 text-sm font-medium text-slate-600">{patent.inventors}</p>
                <p className="mt-4 flex-1 leading-6 text-slate-700 text-sm">{patent.description}</p>

                {patent.link && (
                  <a
                    href={patent.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm font-semibold text-navy hover:bg-slate-100 transition w-fit"
                  >
                    View details
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </article>
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-12 text-center">
              <p className="text-slate-600">No patents found matching your search.</p>
            </div>
          )}
        </div>

        {data.totalPages > 1 && (
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            baseUrl="/patents"
            params={{ query: data.query, sort: data.sort }}
          />
        )}
      </section>

      <section className="bg-navy/5 py-16">
        <div className="section-shell text-center max-w-2xl mx-auto">
          <p className="text-sm font-semibold text-navy uppercase">Intellectual Property</p>
          <h2 className="mt-3 text-2xl font-semibold text-ink">Our innovations driving the future</h2>
          <p className="mt-4 leading-7 text-slate-700">
            These patents represent years of research and development in RF microelectronics and advanced circuit design.
          </p>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-500">
        <p>© 2026 Dr. Darshak Bhatt. RISHI Lab, IIT Roorkee.</p>
      </footer>
    </main>
  );
}
