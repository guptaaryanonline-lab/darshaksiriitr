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
        <div className="relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
          <div className="max-w-3xl text-white">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-cyan-200">RISHI Lab, IIT Roorkee</p>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">Dr. Darshak Bhatt</h1>
            <p className="mt-5 text-lg sm:text-xl text-white/90">Associate Professor, Electronics and Communication Engineering</p>
            <p className="mt-5 max-w-2xl text-base sm:text-lg leading-8 text-white/82">
              Advancing RF microelectronics and analog circuit design for wireless, quantum, and sub-THz applications.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#projects" className="inline-block rounded bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
                View Research
              </a>
              <a href="mailto:darshak.bhatt@ece.iitr.ac.in" className="inline-block rounded bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
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
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="mailto:darshak.bhatt@ece.iitr.ac.in"
              className="inline-block rounded bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Contact Me
            </a>
            <a
              href="#"
              className="inline-block rounded bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Download CV
            </a>
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

      <section className="bg-white">
        <div className="section-shell">
          <SectionTitle eyebrow="Featured Research" title="Explore the lab’s active directions" />
          <p className="mt-4 max-w-2xl text-slate-700">
            Discover the core research themes that drive RISHI Lab, from RF microelectronics to sub-THz systems.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {research.slice(0, 3).map((area) => (
              <article key={area.id} className="panel p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal">{area.title}</p>
                <p className="mt-4 leading-7 text-slate-700">{area.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {asStringArray(area.topics).slice(0, 4).map((topic) => (
                    <span key={topic} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                      {topic}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Link href="/research" className="inline-block rounded bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
              Explore all research
            </Link>
          </div>
        </div>
      </section>

      <section className="section-shell py-16">
        <SectionTitle eyebrow="Milestones" title="Key achievements & highlights" />
        <p className="mt-4 max-w-2xl text-slate-700">
          Recognition and accomplishments marking significant milestones in research excellence and academic career.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition">
            <p className="text-sm font-bold text-navy mb-2">2025</p>
            <h3 className="text-lg font-semibold text-ink">Promoted to Associate Professor</h3>
            <p className="mt-3 leading-6 text-slate-700">
              Promoted to Associate Professor at IIT Roorkee, recognizing contributions to RF microelectronics research and academic excellence.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition">
            <p className="text-sm font-bold text-navy mb-2">2023</p>
            <h3 className="text-lg font-semibold text-ink">IEEE Conference Publications</h3>
            <p className="mt-3 leading-6 text-slate-700">
              Multiple papers accepted at prestigious IEEE conferences including ISCAS and IWCMC, advancing RF circuit design knowledge.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition">
            <p className="text-sm font-bold text-navy mb-2">2013</p>
            <h3 className="text-lg font-semibold text-ink">Prime Minister Fellowship</h3>
            <p className="mt-3 leading-6 text-slate-700">
              Awarded prestigious Prime Minister Fellowship by IITB-Monash Research Academy for exceptional research contributions.
            </p>
          </article>
        </div>
      </section>

      <section className="section-shell">
        <SectionTitle eyebrow="Featured Projects" title="Selected flagship efforts" />
        <p className="mt-4 max-w-2xl text-slate-700">
          View a curated selection of current and completed projects, then explore the full portfolio on the projects page.
        </p>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {projects.slice(0, 3).map((project) => (
            <article key={project.id} className="panel p-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-semibold text-ink">{project.title}</h3>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                  {project.status}
                </span>
              </div>
              <p className="mt-2 text-sm font-medium text-slate-500">{project.duration}</p>
              <p className="mt-5 leading-7 text-slate-700">{project.description}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Link href="/projects" className="inline-block rounded bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
            Explore all projects
          </Link>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="section-shell grid gap-6 md:grid-cols-3">
          <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Patents</p>
            <p className="mt-4 text-3xl font-semibold text-ink">{patents.length}</p>
            <p className="mt-3 leading-7 text-slate-600">Explore the lab’s intellectual property and invention portfolio.</p>
            <Link href="/patents" className="mt-6 inline-flex items-center text-sm font-semibold text-navy hover:text-ink">
              View patents
            </Link>
          </article>
          <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Students</p>
            <p className="mt-4 text-3xl font-semibold text-ink">{students.length}</p>
            <p className="mt-3 leading-7 text-slate-600">Meet the current research team and active student contributors.</p>
            <Link href="/students" className="mt-6 inline-flex items-center text-sm font-semibold text-navy hover:text-ink">
              View students
            </Link>
          </article>
          <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Goals</p>
            <p className="mt-4 text-3xl font-semibold text-ink">{goals.length}</p>
            <p className="mt-3 leading-7 text-slate-600">Check the lab’s strategic goals, timelines, and future priorities.</p>
            <Link href="/goals" className="mt-6 inline-flex items-center text-sm font-semibold text-navy hover:text-ink">
              View goals
            </Link>
          </article>
        </div>
      </section>

      <section className="section-shell">
        <div className="rounded-[2rem] bg-gradient-to-r from-navy to-cyan-600 px-8 py-12 text-white shadow-soft">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">Connect</p>
            <h2 className="mt-4 text-3xl font-semibold">Interested in collaboration or student projects?</h2>
            <p className="mt-4 leading-7 text-slate-100/90">
              Reach out to discuss research partnerships, PhD/M.Tech projects, lab visits, or industry-sponsored work.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="inline-block rounded bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
                Contact the lab
              </Link>
              <a href="mailto:darshak.bhatt@ece.iitr.ac.in" className="inline-block rounded bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
                Email directly
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-500">
        <p>© 2026 Dr. Darshak Bhatt. RISHI Lab, IIT Roorkee.</p>
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
