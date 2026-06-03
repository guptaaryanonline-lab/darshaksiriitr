import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Radio, Target, Users } from "lucide-react";
import { HeroCarousel } from "@/components/hero-carousel";
import { SiteHeader } from "@/components/site-header";
import { asStringArray, getSiteContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { projects, research, patents, students, goals } = await getSiteContent();
  const activeProjects = projects.filter((project) => project.status.toLowerCase() === "active").length;

  return (
    <main>
      <SiteHeader />

      <section className="relative flex min-h-[calc(100vh-73px)] items-center overflow-hidden">
        <HeroCarousel />
        <div className="relative mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
          <div className="max-w-3xl text-white">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-cyan-200">RISHI Lab, IIT Roorkee</p>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">Dr. Darshak Bhatt</h1>
            <p className="mt-5 text-xl text-white/90">Associate Professor, Electronics and Communication Engineering</p>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/82">
              Advancing RF microelectronics and analog circuit design for wireless, quantum, and sub-THz applications.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#projects" className="rounded-md bg-white px-5 py-3 text-sm font-semibold text-ink hover:bg-slate-100">
                View Research
              </a>
              <a href="mailto:darshak.bhatt@ece.iitr.ac.in" className="rounded-md border border-white/45 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">
                Contact
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="eyebrow">About</p>
          <h2 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">RF Integrated Circuit and System Innovation Lab</h2>
          <div className="mt-6 space-y-4 text-base leading-8 text-slate-700">
            <p>
              Dr. Darshak Bhatt leads RISHI Lab in the Department of Electronics and Communication Engineering at IIT Roorkee.
              The lab works on RFIC design, receiver architectures, cryogenic RF front ends, and mm-wave systems.
            </p>
            <p>
              The research combines circuit-level innovation with practical implementation, measurement, publications, patents,
              and student training for emerging wireless and quantum technologies.
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Metric value={`${projects.length}`} label="Projects" />
            <Metric value={`${activeProjects}`} label="Active" />
            <Metric value={`${students.length}`} label="Students" />
          </div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-slate-200 shadow-soft">
          <Image src="/images/myphoto2.jpg" alt="Dr. Darshak Bhatt" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover object-top" />
        </div>
      </section>

      <section id="research" className="bg-white">
        <div className="section-shell">
          <SectionTitle eyebrow="Research" title="Focused areas of work" />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {research.map((area) => (
              <article key={area.id} className="panel p-6">
                <Radio className="mb-4 h-6 w-6 text-teal" />
                <h3 className="text-xl font-semibold text-ink">{area.title}</h3>
                <p className="mt-3 leading-7 text-slate-700">{area.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {asStringArray(area.topics).map((topic) => (
                    <span key={topic} className="rounded-md bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                      {topic}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="section-shell">
        <SectionTitle eyebrow="Projects" title="Current and completed research projects" />
        <div className="mt-8 grid gap-6">
          {projects.map((project) => (
            <article key={project.id} className="panel overflow-hidden">
              <div className="grid lg:grid-cols-[0.42fr_0.58fr]">
                <div className="relative min-h-72 bg-slate-200">
                  <Image
                    src={project.image || "/images/RISHI_LAB.png"}
                    alt={project.title}
                    fill
                    sizes="(min-width: 1024px) 42vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6 sm:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h3 className="max-w-2xl text-2xl font-semibold text-ink">{project.title}</h3>
                    <span className="rounded-md bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">{project.status}</span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-slate-500">{project.duration}</p>
                  <p className="mt-5 leading-7 text-slate-700">{project.description}</p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {asStringArray(project.objectives).map((objective) => (
                      <div key={objective} className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                        {objective}
                      </div>
                    ))}
                  </div>
                  {project.impact ? <p className="mt-5 border-l-4 border-teal pl-4 font-medium text-ink">{project.impact}</p> : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="patents" className="bg-white">
        <div className="section-shell">
          <SectionTitle eyebrow="Patents" title="Intellectual property and inventions" />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {patents.map((patent) => (
              <article key={patent.id} className="panel p-6">
                <p className="text-sm font-semibold text-gold">{patent.year} | {patent.status}</p>
                <h3 className="mt-3 text-xl font-semibold text-ink">{patent.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{patent.inventors}</p>
                <p className="mt-4 leading-7 text-slate-700">{patent.description}</p>
                {patent.link ? <a href={patent.link} className="mt-4 inline-block text-sm font-semibold text-teal">View details</a> : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="students" className="section-shell">
        <SectionTitle eyebrow="Students" title="Research group" />
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {students.map((student) => (
            <article key={student.id} className="panel p-6">
              <Users className="h-6 w-6 text-teal" />
              <h3 className="mt-4 text-xl font-semibold text-ink">{student.name}</h3>
              <p className="mt-1 text-sm font-semibold text-slate-500">{student.program} | {student.status}</p>
              <p className="mt-4 leading-7 text-slate-700">{student.topic}</p>
              {student.email ? <a href={`mailto:${student.email}`} className="mt-4 inline-block text-sm font-semibold text-teal">{student.email}</a> : null}
            </article>
          ))}
        </div>
      </section>

      <section id="goals" className="bg-ink text-white">
        <div className="section-shell">
          <SectionTitle eyebrow="Goals" title="Where the lab is heading" dark />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {goals.map((goal) => (
              <article key={goal.id} className="rounded-lg border border-white/12 bg-white/7 p-6">
                <Target className="h-6 w-6 text-cyan-200" />
                <p className="mt-4 text-sm font-semibold text-cyan-200">{goal.category} | {goal.status}{goal.targetYear ? ` | ${goal.targetYear}` : ""}</p>
                <h3 className="mt-3 text-xl font-semibold">{goal.title}</h3>
                <p className="mt-4 leading-7 text-white/78">{goal.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="section-shell">
        <div className="panel grid gap-8 p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="eyebrow">Contact</p>
            <h2 className="mt-3 text-3xl font-semibold text-ink">Collaborate with RISHI Lab</h2>
            <p className="mt-4 leading-7 text-slate-700">
              Open to prospective students, research collaborators, visiting scholars, and industry partners.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <ContactItem icon={<Mail className="h-5 w-5" />} label="Email" value="darshak.bhatt@ece.iitr.ac.in" href="mailto:darshak.bhatt@ece.iitr.ac.in" />
            <ContactItem icon={<MapPin className="h-5 w-5" />} label="Address" value="ECE Department, IIT Roorkee" />
            <ContactItem label="Google Scholar" value="View profile" href="https://scholar.google.com/citations?hl=en&user=XOKWdPAAAAAJ" />
            <ContactItem label="Faculty Page" value="IIT Roorkee profile" href="https://iitr.ac.in/Departments/Electronics%20and%20Communication%20Engineering%20Department/People/Faculty/100822.html" />
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-500">
        <p>© 2026 Dr. Darshak Bhatt. RISHI Lab, IIT Roorkee.</p>
        <Link href="/admin" className="mt-2 inline-block font-semibold text-teal">Admin panel</Link>
      </footer>
    </main>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-3xl font-semibold text-navy">{value}</p>
      <p className="mt-1 text-sm font-medium text-slate-600">{label}</p>
    </div>
  );
}

function SectionTitle({ eyebrow, title, dark = false }: { eyebrow: string; title: string; dark?: boolean }) {
  return (
    <div className="max-w-3xl">
      <p className={dark ? "text-sm font-semibold uppercase tracking-[0.14em] text-cyan-200" : "eyebrow"}>{eyebrow}</p>
      <h2 className={`mt-3 text-3xl font-semibold sm:text-4xl ${dark ? "text-white" : "text-ink"}`}>{title}</h2>
    </div>
  );
}

function ContactItem({ icon, label, value, href }: { icon?: React.ReactNode; label: string; value: string; href?: string }) {
  const body = (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
        {icon}
        {label}
      </div>
      <p className="mt-2 font-semibold text-ink">{value}</p>
    </div>
  );

  return href ? (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="block hover:opacity-90">
      {body}
    </a>
  ) : (
    body
  );
}
