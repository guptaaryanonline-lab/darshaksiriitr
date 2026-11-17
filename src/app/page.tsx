import Image from "next/image";
import Link from "next/link";
import { Radio } from "lucide-react";
import { HeroCarousel } from "@/components/hero-carousel";
import { SiteHeader } from "@/components/site-header";
import { asStringArray, getSiteContent } from "@/lib/content";
import { imageFitClass, imageFrameBg } from "@/lib/image-fit";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { hero, projects, research, publications, students, goals } = await getSiteContent();

  return (
    <main>
      <SiteHeader />

      <HeroCarousel slides={hero.map(({ image, position, caption }) => ({ image, position, caption }))}>
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-24 pt-14 sm:px-8 sm:py-24 lg:px-10">
          <div className="max-w-3xl text-white">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-cyan-100">RISHI Lab, IIT Roorkee</p>
            <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">Dr. Darshak Bhatt</h1>
            <p className="mt-6 text-lg font-medium text-white sm:text-xl">Associate Professor, Electronics and Communication Engineering</p>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
              Advancing RF microelectronics and analog circuit design for wireless, quantum, and sub-THz applications.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#research" className="btn-primary">
                View Research
              </a>
              <a href="mailto:darshak.bhatt@ece.iitr.ac.in" className="btn-secondary !border-white/40 !bg-white/10 !text-white hover:!bg-white/20">
                Contact
              </a>
            </div>
          </div>
        </div>
      </HeroCarousel>

      <section className="section-shell grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="eyebrow">About</p>
          <div className="mt-4 flex items-center gap-3">
            <Image
              src="/images/RISHI_LAB.png"
              alt="RISHI Lab — RF Integrated Circuit and System Innovation Lab"
              width={56}
              height={56}
              className="h-12 w-12 shrink-0 object-contain sm:h-14 sm:w-14"
            />
            <h2 className="text-2xl font-semibold text-ink sm:text-3xl">RF Integrated Circuit and System Innovation Lab</h2>
          </div>
          <div className="mt-6 space-y-4 text-base leading-8 text-slate-700">
            <p>
              Dr. Darshak Bhatt leads RISHI Lab in the Department of Electronics and Communication Engineering at IIT Roorkee.
              The lab works on RFIC design, receiver architectures, cryogenic RF front ends, and mm-wave systems.
            </p>
            <p>
              The research combines circuit-level innovation with practical implementation, measurement, publications,
              and student training for emerging wireless and quantum technologies.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="mailto:darshak.bhatt@ece.iitr.ac.in" className="btn-primary">
              Contact me
            </a>
            <Link href="/contact" className="btn-secondary">
              Download CV
            </Link>
          </div>
        </div>
        <div className="relative mx-auto aspect-[4/5] w-full max-w-[18rem] overflow-hidden rounded-3xl border border-slate-200/60 bg-slate-200 shadow-soft transition duration-300 hover:shadow-xl sm:max-w-xs lg:mr-0 lg:max-w-sm">
          <Image src="/images/myphoto2.jpg" alt="Dr. Darshak Bhatt" fill sizes="(min-width: 1024px) 24rem, 20rem" className="object-cover object-top" />
        </div>
      </section>

      <section id="research" className="bg-white">
        <div className="section-shell">
          <SectionTitle eyebrow="Research" title="Focused areas of work" />
          <p className="mt-4 max-w-2xl text-slate-700">
            The core research themes that drive RISHI Lab, from RF microelectronics to sub-THz systems.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {research.map((area) => (
              <article key={area.id} className="panel p-6">
                <Radio className="mb-4 h-6 w-6 text-teal" />
                <h3 className="text-xl font-semibold text-ink">{area.title}</h3>
                <p className="mt-3 leading-7 text-slate-700">{area.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {asStringArray(area.topics).map((topic) => (
                    <span key={topic} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                      {topic}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Link href="/research" className="btn-primary">
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
          <article className="panel p-6 sm:p-8">
            <span className="inline-flex rounded-full bg-navy/10 px-3 py-1 text-sm font-bold text-navy">2025</span>
            <h3 className="mt-4 text-lg font-semibold text-ink">Promoted to Associate Professor</h3>
            <p className="mt-3 leading-6 text-slate-700">
              Promoted to Associate Professor at IIT Roorkee, recognizing contributions to RF microelectronics research and academic excellence.
            </p>
          </article>

          <article className="panel p-6 sm:p-8">
            <span className="inline-flex rounded-full bg-navy/10 px-3 py-1 text-sm font-bold text-navy">2023</span>
            <h3 className="mt-4 text-lg font-semibold text-ink">IEEE Conference Publications</h3>
            <p className="mt-3 leading-6 text-slate-700">
              Multiple papers accepted at prestigious IEEE conferences including ISCAS and IWCMC, advancing RF circuit design knowledge.
            </p>
          </article>

          <article className="panel p-6 sm:p-8">
            <span className="inline-flex rounded-full bg-navy/10 px-3 py-1 text-sm font-bold text-navy">2013</span>
            <h3 className="mt-4 text-lg font-semibold text-ink">Prime Minister Fellowship</h3>
            <p className="mt-3 leading-6 text-slate-700">
              Awarded prestigious Prime Minister Fellowship by IITB-Monash Research Academy for exceptional research contributions.
            </p>
          </article>
        </div>
      </section>

      <section className="section-shell">
        <SectionTitle eyebrow="Featured Projects" title="Selected flagship efforts" />
        <p className="mt-4 max-w-2xl text-slate-700">
          A curated selection of current and completed projects — explore the full portfolio on the projects page.
        </p>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {projects.slice(0, 3).map((project) => (
            <article key={project.id} className="panel overflow-hidden p-0">
              {typeof project.image === "string" && project.image ? (
                <div className={`relative aspect-[16/10] overflow-hidden ${imageFrameBg(project.image)}`}>
                  <Image src={project.image} alt="" fill sizes="(min-width: 1024px) 33vw, 100vw" className={imageFitClass(project.image)} />
                </div>
              ) : null}
              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl font-semibold text-ink">{project.title}</h3>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass(String(project.status))}`}
                  >
                    {project.status}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium text-slate-500">{project.duration}</p>
                <p className="mt-4 leading-7 text-slate-700">{project.description}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Link href="/projects" className="btn-primary">
            Explore all projects
          </Link>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="section-shell grid gap-6 md:grid-cols-3">
          <article className="group rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Publications</p>
            <p className="mt-4 text-4xl font-semibold tabular-nums tracking-tight text-ink sm:text-5xl">{publications.length}</p>
            <p className="mt-3 leading-7 text-slate-600">Browse the lab’s journal articles and conference papers.</p>
            <Link href="/publications" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-navy transition group-hover:gap-2.5 hover:text-ink">
              View publications
              <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </Link>
          </article>
          <article className="group rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Students</p>
            <p className="mt-4 text-4xl font-semibold tabular-nums tracking-tight text-ink sm:text-5xl">{students.length}</p>
            <p className="mt-3 leading-7 text-slate-600">Meet the current research team and active student contributors.</p>
            <Link href="/students" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-navy transition group-hover:gap-2.5 hover:text-ink">
              View students
              <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </Link>
          </article>
          <article className="group rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Goals</p>
            <p className="mt-4 text-4xl font-semibold tabular-nums tracking-tight text-ink sm:text-5xl">{goals.length}</p>
            <p className="mt-3 leading-7 text-slate-600">Check the lab’s strategic goals, timelines, and future priorities.</p>
            <Link href="/goals" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-navy transition group-hover:gap-2.5 hover:text-ink">
              View goals
              <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </Link>
          </article>
        </div>
      </section>

      <section className="section-shell">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy via-navy to-ink px-6 py-14 text-white shadow-xl sm:px-10 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-teal/20 blur-3xl"
          />
          <div className="relative max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">Connect</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Interested in collaboration or student projects?</h2>
            <p className="mt-4 max-w-xl leading-7 text-white/80">
              Reach out to discuss research partnerships, PhD/M.Tech projects, lab visits, or industry-sponsored work.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-navy transition duration-200 hover:bg-slate-100 hover:shadow-lg active:scale-[0.98]">
                Contact the lab
              </Link>
              <a
                href="mailto:darshak.bhatt@ece.iitr.ac.in"
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-white/20 active:scale-[0.98]"
              >
                Email directly
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-500">
        <p>© {new Date().getFullYear()} Dr. Darshak Bhatt. RISHI Lab, IIT Roorkee.</p>
      </footer>
    </main>
  );
}

function SectionTitle({ eyebrow, title, dark = false }: { eyebrow: string; title: string; dark?: boolean }) {
  return (
    <div className="max-w-3xl">
      <p className={dark ? "text-sm font-semibold uppercase tracking-[0.14em] text-cyan-200" : "eyebrow"}>{eyebrow}</p>
      <h2 className={`mt-3 text-3xl font-semibold tracking-tight sm:text-4xl ${dark ? "text-white" : "text-ink"}`}>{title}</h2>
    </div>
  );
}

function statusBadgeClass(status: string) {
  const normalized = status.toLowerCase();
  if (normalized.includes("complet")) return "bg-slate-100 text-slate-600";
  if (normalized.includes("progress")) return "bg-amber-50 text-amber-700";
  return "bg-emerald-50 text-emerald-700";
}
