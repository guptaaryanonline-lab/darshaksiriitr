import { SiteHeader } from "@/components/site-header";
import { StudentCarousel } from "@/components/student-carousel";
import { getStudentGroups } from "@/lib/content";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Students | Dr. Darshak Bhatt | RISHI Lab",
  description: "Meet the talented researchers and students in RISHI Lab."
};

export default async function StudentsPage() {
  const { current, placed } = await getStudentGroups();

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

        <div className="space-y-14">
          <StudentCarousel
            title="Current Students"
            subtitle="Active PhD scholars, M.Tech students, and researchers currently working at RISHI Lab."
            students={current}
          />
          <StudentCarousel
            title="Placed Students"
            subtitle="Alumni who trained at RISHI Lab and have since moved on to academia and industry roles."
            students={placed}
          />

          {current.length === 0 && placed.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
              <p className="text-slate-600">No students to show yet.</p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-slate-900 text-white py-16">
        <div className="section-shell max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold">Join RISHI Lab</h2>
          <p className="mt-4 leading-7 text-slate-300">
            We are always looking for motivated students interested in RF microelectronics, circuit design, and advanced research. Explore opportunities to work with us.
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
