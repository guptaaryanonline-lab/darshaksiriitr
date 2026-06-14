import { SiteHeader } from "@/components/site-header";
import { SearchFilter } from "@/components/search-filter";
import { Pagination } from "@/components/pagination";
import { getGoalPage } from "@/lib/content";
import { Target, Calendar } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Goals | Dr. Darshak Bhatt | RISHI Lab",
  description: "Strategic goals and future priorities of RISHI Lab."
};

export default async function GoalsPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const data = await getGoalPage(searchParams);

  return (
    <main>
      <SiteHeader />

      <section className="section-shell pt-8">
        <div className="mb-8 max-w-3xl">
          <p className="eyebrow">Strategic Vision</p>
          <h1 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">Lab Goals & Roadmap</h1>
          <p className="mt-4 leading-7 text-slate-700">
            Our strategic objectives and future priorities driving RISHI Lab's research direction and impact.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {data.goals.length > 0 ? (
            data.goals.map((goal) => (
              <article key={goal.id} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-slate-300 sm:p-6 flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="rounded-lg bg-cyan-50 p-3">
                    <Target className="h-6 w-6 text-cyan-600" />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      {goal.status}
                    </span>
                    {goal.targetYear && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600">
                        <Calendar className="h-3 w-3" />
                        {goal.targetYear}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{goal.category}</p>
                <h3 className="mt-2 text-lg font-semibold text-ink leading-tight">{goal.title}</h3>
                <p className="mt-4 flex-1 leading-6 text-slate-700">{goal.description}</p>
              </article>
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-12 text-center">
              <p className="text-slate-600">No goals found matching your search.</p>
            </div>
          )}
        </div>

        {data.totalPages > 1 && (
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            baseUrl="/goals"
            params={{ query: data.query, sort: data.sort }}
          />
        )}
      </section>

      <section className="bg-gradient-to-r from-navy to-cyan-600 text-white py-16">
        <div className="section-shell max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold">Aligned with your vision?</h2>
          <p className="mt-4 leading-7 text-slate-100">
            If our research goals align with your interests, we'd love to hear from you for potential collaborations and partnerships.
          </p>
          <Link href="/contact" className="mt-6 inline-block rounded bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
            Reach out to us
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-500">
        <p>© 2026 Dr. Darshak Bhatt. RISHI Lab, IIT Roorkee.</p>
      </footer>
    </main>
  );
}
