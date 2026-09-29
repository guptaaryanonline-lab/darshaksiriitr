import { SiteHeader } from "@/components/site-header";
import { SearchFilter } from "@/components/search-filter";
import { Pagination } from "@/components/pagination";
import { getCoursePage, asStringArray } from "@/lib/content";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Teaching | Dr. Darshak Bhatt | RISHI Lab",
  description: "Courses taught, student supervision, and teaching resources from Dr. Darshak Bhatt."
};

const studentAreas = [
  "RF Front-End Design for Advanced Wireless Systems",
  "Cryogenic RFIC for Quantum Computing Applications",
  "mm-Wave and Sub-THz Circuit Design",
  "Low-Power Transceiver Architectures",
  "Noise Cancellation Techniques in RF Circuits"
];

const resources = [
  "Simulation tutorials using Cadence Virtuoso and Keysight ADS",
  "Reference material from leading IEEE journals and conferences",
  "Industry case studies and design examples"
];

export default async function TeachingPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const data = await getCoursePage(searchParams);

  return (
    <main>
      <SiteHeader />

      <section className="section-shell pt-8">
        <div className="mb-8 max-w-3xl">
          <p className="eyebrow">Academics</p>
          <h1 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">Teaching</h1>
          <p className="mt-4 leading-7 text-slate-700">
            I believe in combining rigorous theoretical foundations with practical, hands-on learning experiences. My courses emphasize both analytical understanding and design intuition,
            preparing students to tackle real-world RF and microwave engineering challenges.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="leading-7 text-slate-700">
            I encourage students to connect classroom concepts with cutting-edge research through projects, simulations using industry-standard tools, and exposure to current literature in the field.
          </p>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold text-ink">Courses Taught</h2>

          <div className="mt-6">
            <SearchFilter
              pageUrl="/teaching"
              placeholder="Search courses by code, title, or topic..."
              sortOptions={[
                { label: "Recent", value: "recent" },
                { label: "Title (A-Z)", value: "title" }
              ]}
            />
          </div>

          <div className="mt-6 space-y-5">
            {data.courses.length > 0 ? (
              data.courses.map((course) => (
                <article key={course.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-slate-300 sm:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-ink">
                        {course.code}: {course.title}
                      </h3>
                      <p className="mt-1 text-sm font-medium text-slate-600">
                        {course.term} - {course.level}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 leading-7 text-slate-700">{course.description}</p>
                  <div className="mt-4">
                    <p className="mb-2 text-sm font-semibold text-slate-600">Key Topics:</p>
                    <div className="flex flex-wrap gap-2">
                      {asStringArray(course.topics).map((topic) => (
                        <span key={topic} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                <p className="text-slate-600">No courses found matching your search.</p>
              </div>
            )}
          </div>

          {data.totalPages > 1 && (
            <div className="mt-8">
              <Pagination page={data.page} totalPages={data.totalPages} baseUrl="/teaching" params={{ query: data.query, sort: data.sort }} />
            </div>
          )}
        </div>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold text-ink">Student Supervision</h2>
          <p className="mt-4 leading-7 text-slate-700">
            I actively supervise PhD scholars, M.Tech students, and B.Tech projects in the areas of RF microelectronics, analog CMOS design, and wireless communication circuits.
          </p>
          <div className="mt-6">
            <h3 className="font-semibold text-ink">Current Research Areas for Students:</h3>
            <ul className="mt-3 list-inside list-disc space-y-2 text-slate-700">
              {studentAreas.map((area) => (
                <li key={area}>{area}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-10 grid gap-5 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <h3 className="font-semibold text-ink">For Prospective PhD Students</h3>
            <p className="mt-3 leading-7 text-slate-700">
              I welcome applications from motivated students with strong backgrounds in electronics, microwave engineering, or RF design. Familiarity with circuit simulation tools
              (Cadence, ADS) is advantageous.
            </p>
            <a
              href="mailto:darshak.bhatt@ece.iitr.ac.in"
              className="mt-4 inline-block cursor-pointer text-sm font-semibold text-navy transition duration-150 hover:text-ink hover:underline"
            >
              Contact for PhD opportunities
            </a>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <h3 className="font-semibold text-ink">For B.Tech/M.Tech Projects</h3>
            <p className="mt-3 leading-7 text-slate-700">
              IIT Roorkee students interested in pursuing projects related to RF/analog IC design are encouraged to reach out. Projects range from circuit design to system-level implementations.
            </p>
            <a
              href="mailto:darshak.bhatt@ece.iitr.ac.in"
              className="mt-4 inline-block cursor-pointer text-sm font-semibold text-navy transition duration-150 hover:text-ink hover:underline"
            >
              Inquire about project topics
            </a>
          </article>
        </section>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-ink">Teaching Resources</h2>
          <p className="mt-4 leading-7 text-slate-700">
            Course materials, lecture notes, and assignments are made available to enrolled students through the IIT Roorkee academic portal.
          </p>
          <ul className="mt-4 list-inside list-disc space-y-2 text-slate-700">
            {resources.map((resource) => (
              <li key={resource}>{resource}</li>
            ))}
          </ul>
        </section>
      </section>

      <section className="bg-slate-900 text-white py-16">
        <div className="section-shell max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold">Interested in research with RISHI Lab?</h2>
          <p className="mt-4 leading-7 text-slate-300">
            Reach out to discuss PhD opportunities, M.Tech/B.Tech projects, or course-related queries.
          </p>
          <Link href="/contact" className="btn-primary mt-6">
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
