import { SiteHeader } from "@/components/site-header";
import { SearchFilter } from "@/components/search-filter";
import { Pagination } from "@/components/pagination";
import { getProjectPage, asStringArray } from "@/lib/content";
import { imageFitClass, imageFrameBg } from "@/lib/image-fit";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Projects | Dr. Darshak Bhatt | RISHI Lab",
  description: "Explore current and completed research projects from RISHI Lab."
};

export default async function ProjectsPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const data = await getProjectPage(searchParams);

  return (
    <main>
      <SiteHeader />

      <section className="section-shell pt-8">
        <div className="mb-8 flex flex-col gap-6 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="eyebrow">Portfolio</p>
          <h1 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">Research Projects</h1>
          <p className="mt-4 leading-7 text-slate-700">
            Current and completed projects demonstrating our expertise in RF microelectronics, wireless systems, and quantum applications.
          </p>
        </div>

        <div className="shrink-0">
        <SearchFilter
          pageUrl="/projects"
          showSearch={false}
          filterOptions={[
            {
              label: "Status",
              key: "status",
              options: data.statusOptions.map((s) => ({ label: s, value: s }))
            }
          ]}
          sortOptions={[
            { label: "Recent", value: "recent" },
            { label: "Title (A-Z)", value: "title" },
            { label: "Title (Z-A)", value: "title-desc" },
            { label: "Publications", value: "publications" }
          ]}
        />
        </div>
        </div>

        <div className="space-y-6">
          {data.projects.length > 0 ? (
            data.projects.map((project, idx) => (
              <article key={project.id} className="group rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md hover:border-slate-300 overflow-hidden">
                <div className="grid lg:grid-cols-[0.45fr_0.55fr]">
                  <div className={`relative aspect-[16/9] overflow-hidden lg:aspect-auto lg:min-h-80 ${project.image ? imageFrameBg(project.image) : "hidden bg-slate-200 lg:block"}`}>
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(min-width: 1024px) 45vw, 100vw"
                        className={`${imageFitClass(project.image)} transition duration-500 group-hover:scale-105`}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
                        <div className="text-center">
                          <p className="text-slate-500 font-semibold">{project.title}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-between p-5 sm:p-8">
                    <div>
                      <div className="flex items-baseline gap-3 mb-3">
                        <span className="text-sm font-bold text-navy">
                          {String((data.page - 1) * data.perPage + idx + 1).padStart(2, "0")}
                        </span>
                        <h2 className="text-xl font-semibold leading-snug text-ink sm:text-2xl">{project.title}</h2>
                      </div>
                      <div className="mb-4 mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                          {project.status}
                        </span>
                        <p className="text-sm font-medium text-slate-500">{project.duration}</p>
                      </div>
                      <p className="leading-7 text-slate-700">{project.description}</p>
                      <div className="mt-5 grid gap-2 sm:grid-cols-2">
                        {asStringArray(project.objectives)
                          .slice(0, 4)
                          .map((objective) => (
                            <div key={objective} className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                              • {objective}
                            </div>
                          ))}
                      </div>
                      {project.impact && <p className="mt-5 border-l-4 border-teal pl-4 font-medium text-ink text-sm">{project.impact}</p>}
                    </div>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 text-center">
              <p className="text-slate-600">No projects found matching your criteria.</p>
            </div>
          )}
        </div>

        {data.totalPages > 1 && (
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            baseUrl="/projects"
            params={{ query: data.query, status: data.status, sort: data.sort }}
          />
        )}
      </section>


      <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-500">
        <p>© {new Date().getFullYear()} Dr. Darshak Bhatt. RISHI Lab, IIT Roorkee.</p>
      </footer>
    </main>
  );
}
