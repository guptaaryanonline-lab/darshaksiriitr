import { SiteHeader } from "@/components/site-header";
import { SearchFilter } from "@/components/search-filter";
import { Pagination } from "@/components/pagination";
import { getResearchPage } from "@/lib/content";
import { asStringArray } from "@/lib/content";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Research | Dr. Darshak Bhatt | RISHI Lab",
  description: "Explore the research areas and focus domains of RISHI Lab at IIT Roorkee."
};

export default async function ResearchPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const data = await getResearchPage(searchParams);

  return (
    <main>
      <SiteHeader />

      <section className="section-shell pt-8">
        <div className="mb-8 max-w-3xl">
          <p className="eyebrow">Expertise & Focus</p>
          <h1 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">Research Areas</h1>
          <p className="mt-4 leading-7 text-slate-700">
            RISHI Lab specializes in RF microelectronics, analog circuits, and system design for wireless and quantum applications. Explore our research domains below.
          </p>
        </div>

        <SearchFilter
          pageUrl="/research"
          placeholder="Search research areas..."
          sortOptions={[
            { label: "Recent", value: "recent" },
            { label: "Title (A-Z)", value: "title" }
          ]}
        />

        <div className="mt-8 space-y-4">
          {data.research.length > 0 ? (
            data.research.map((area, idx) => (
              <article key={area.id} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-slate-300 sm:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-sm font-bold text-navy">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <h2 className="text-2xl font-semibold text-ink">{area.title}</h2>
                    </div>
                    <p className="mt-4 leading-7 text-slate-700">{area.description}</p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {asStringArray(area.topics).map((topic) => (
                        <span key={topic} className="inline-block rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
              <p className="text-slate-600">No research areas found matching your search.</p>
            </div>
          )}
        </div>

        {data.totalPages > 1 && (
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            baseUrl="/research"
            params={{ query: data.query, sort: data.sort }}
          />
        )}
      </section>

      <section className="bg-slate-50 py-16">
        <div className="section-shell text-center">
          <h2 className="text-2xl font-semibold text-ink">Interested in our research?</h2>
          <p className="mt-3 leading-7 text-slate-700">
            Explore our projects and publications to see how these research areas translate into real-world impact.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/projects" className="inline-block rounded bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
              View projects
            </Link>
            <Link href="/contact" className="inline-block rounded bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
              Contact us
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-500">
        <p>© 2026 Dr. Darshak Bhatt. RISHI Lab, IIT Roorkee.</p>
      </footer>
    </main>
  );
}
