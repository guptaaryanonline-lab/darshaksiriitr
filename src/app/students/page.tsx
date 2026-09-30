import { SiteHeader } from "@/components/site-header";
import { StudentGrid } from "@/components/student-grid";
import { getStudentGroups } from "@/lib/content";
import Link from "next/link";
import { Users } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Students | Dr. Darshak Bhatt | RISHI Lab",
  description: "Meet the researchers and students of RISHI Lab, and the alumni who trained here."
};

export default async function StudentsPage() {
  const { current, placed } = await getStudentGroups();

  return (
    <main>
      <SiteHeader />

      <section className="section-shell pt-6 sm:pt-8">
        <div className="mb-8 max-w-3xl sm:mb-10">
          <p className="eyebrow">Research Team</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Lab Members</h1>
          <p className="mt-4 leading-7 text-slate-700">
            PhD scholars, M.Tech students, and researchers working on RF microelectronics at RISHI Lab, and the alumni who trained here.
          </p>
        </div>

        <div className="space-y-12 sm:space-y-16">
          <StudentGrid
            title="Current Students"
            subtitle="Active PhD scholars, M.Tech students, and researchers currently working at RISHI Lab."
            students={current}
          />
          <StudentGrid
            title="Placed Alumni"
            subtitle="Alumni who trained at RISHI Lab and have moved on to academia and industry."
            students={placed}
          />

          {current.length === 0 && placed.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center sm:p-12">
              <Users className="mx-auto mb-4 h-10 w-10 text-slate-300" />
              <p className="text-slate-600">No students to show yet.</p>
            </div>
          )}
        </div>
      </section>

      <section className="section-shell pt-0">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy via-navy to-ink px-6 py-12 text-center text-white shadow-xl sm:px-10 sm:py-16">
          <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Join RISHI Lab</h2>
            <p className="mt-4 leading-7 text-white/80">
              We are always looking for motivated students interested in RF microelectronics, circuit design, and advanced research.
            </p>
            <Link
              href="/contact"
              className="mt-7 inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-navy transition duration-200 hover:bg-slate-100 active:scale-[0.98]"
            >
              Get in touch
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
