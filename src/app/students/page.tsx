import { SiteHeader } from "@/components/site-header";
import { SearchFilter } from "@/components/search-filter";
import { Pagination } from "@/components/pagination";
import { getStudentPage } from "@/lib/content";
import { Mail, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Students | Dr. Darshak Bhatt | RISHI Lab",
  description: "Meet the talented researchers and students in RISHI Lab."
};

export default async function StudentsPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const data = await getStudentPage(searchParams);

  return (
    <main>
      <SiteHeader />

      <section className="section-shell pt-8">
        <div className="mb-8 max-w-3xl">
          <p className="eyebrow">Research Team</p>
          <h1 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">Lab Members</h1>
          <p className="mt-4 leading-7 text-slate-700">
            A talented team of PhD scholars, M.Tech students, and undergraduate researchers working on cutting-edge RF microelectronics research.
          </p>
        </div>

        <SearchFilter
          pageUrl="/students"
          placeholder="Search by name or research topic..."
          sortOptions={[
            { label: "Name (A-Z)", value: "name" },
            { label: "Program", value: "program" }
          ]}
        />

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.students.length > 0 ? (
            data.students.map((student) => (
              <article
                key={student.id}
                className="group rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md hover:border-slate-300 overflow-hidden flex flex-col"
              >
                {student.image ? (
                  <div className="relative w-full h-56 bg-slate-200 overflow-hidden">
                    <Image
                      src={student.image}
                      alt={student.name}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                ) : (
                  <div className="w-full h-56 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <div className="rounded-full bg-slate-300 p-4">
                      <Users className="h-12 w-12 text-slate-600" />
                    </div>
                  </div>
                )}

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-semibold text-ink">{student.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    {student.program}
                    {student.status && ` • ${student.status}`}
                  </p>

                  <p className="mt-4 flex-1 leading-6 text-slate-700">{student.topic}</p>

                  {student.email && (
                    <a
                      href={`mailto:${student.email}`}
                      className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition w-fit"
                    >
                      <Mail className="h-4 w-4" />
                      Contact
                    </a>
                  )}
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-12 text-center">
              <p className="text-slate-600">No students found matching your search.</p>
            </div>
          )}
        </div>

        {data.totalPages > 1 && (
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            baseUrl="/students"
            params={{ query: data.query, sort: data.sort }}
          />
        )}
      </section>

      <section className="bg-slate-900 text-white py-16">
        <div className="section-shell max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold">Join RISHI Lab</h2>
          <p className="mt-4 leading-7 text-slate-300">
            We are always looking for motivated students interested in RF microelectronics, circuit design, and advanced research. Explore opportunities to work with us.
          </p>
          <Link href="/contact" className="mt-6 inline-block rounded bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
            Get in touch
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-500">
        <p>© 2026 Dr. Darshak Bhatt. RISHI Lab, IIT Roorkee.</p>
      </footer>
    </main>
  );
}
