import { SiteHeader } from "@/components/site-header";
import { getSiteContent } from "@/lib/content";
import { asStringArray } from "@/lib/content";
import Link from "next/link";
import { Zap, Users, Lightbulb, Award, BookOpen, Microscope, Radio, Cpu } from "lucide-react";

export const metadata = {
  title: "Lab | Dr. Darshak Bhatt | RISHI Lab",
  description: "Explore RISHI Lab - RF Integrated Circuit and System Innovation Lab at IIT Roorkee."
};

export const dynamic = "force-dynamic";

export default async function LabPage() {
  const { research, students, projects, patents } = await getSiteContent();

  const facilities = [
    {
      icon: Cpu,
      title: "Advanced RF Design Tools",
      description: "Industry-standard RFIC design and simulation platforms including Cadence, ADS, and HFSS."
    },
    {
      icon: Microscope,
      title: "Measurement Equipment",
      description: "State-of-the-art network analyzers, spectrum analyzers, and RF characterization tools."
    },
    {
      icon: Radio,
      title: "Testing Infrastructure",
      description: "Complete RF and microwave testing setup for circuit validation and prototype characterization."
    },
    {
      icon: Lightbulb,
      title: "Collaborative Workspace",
      description: "Modern lab facilities designed for innovative thinking and team-based research."
    }
  ];

  return (
    <main>
      <SiteHeader />

      {/* Hero Section */}
      <section className="section-shell pt-8 pb-16">
        <div className="max-w-3xl">
          <p className="eyebrow">About RISHI Lab</p>
          <h1 className="mt-3 text-4xl font-semibold text-ink sm:text-5xl">RF Integrated Circuit and System Innovation Lab</h1>
          <p className="mt-6 leading-8 text-lg text-slate-700">
            RISHI Lab is at the forefront of RF and analog integrated circuit design, developing innovative solutions for wireless
            communication, quantum computing, and sub-THz systems. Our research combines circuit-level innovation with practical
            implementation, measurement, publications, and student training.
          </p>
        </div>
      </section>

      {/* Lab Overview Stats */}
      <section className="section-shell">
        <div className="grid gap-6 md:grid-cols-4">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
            <div className="text-3xl font-bold text-navy">{students.length}</div>
            <p className="mt-2 font-semibold text-slate-600">Active Students</p>
            <p className="mt-1 text-sm text-slate-500">PhD & M.Tech researchers</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
            <div className="text-3xl font-bold text-navy">{projects.length}</div>
            <p className="mt-2 font-semibold text-slate-600">Research Projects</p>
            <p className="mt-1 text-sm text-slate-500">Ongoing & completed</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
            <div className="text-3xl font-bold text-navy">{patents.length}</div>
            <p className="mt-2 font-semibold text-slate-600">Patents & IP</p>
            <p className="mt-1 text-sm text-slate-500">Intellectual property</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
            <div className="text-3xl font-bold text-navy">{research.length}</div>
            <p className="mt-2 font-semibold text-slate-600">Research Areas</p>
            <p className="mt-1 text-sm text-slate-500">Specialized domains</p>
          </article>
        </div>
      </section>

      {/* Research Focus Areas */}
      <section className="section-shell pt-16">
        <div className="mb-10 max-w-2xl">
          <p className="eyebrow">Expertise</p>
          <h2 className="mt-3 text-3xl font-semibold text-ink">Research Focus Areas</h2>
          <p className="mt-4 leading-7 text-slate-700">
            We focus on cutting-edge topics in RF microelectronics and analog circuit design with applications spanning wireless systems, quantum technologies, and beyond.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {research.map((area) => (
            <article key={area.id} className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-blue-50 p-3 flex-shrink-0">
                  <Radio className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-ink">{area.title}</h3>
                  <p className="mt-2 leading-6 text-slate-700">{area.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {asStringArray(area.topics)
                      .slice(0, 3)
                      .map((topic) => (
                        <span key={topic} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                          {topic}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/research" className="inline-block rounded bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
            Explore all research areas
          </Link>
        </div>
      </section>

      {/* Lab Facilities */}
      <section className="section-shell pt-16 pb-16">
        <div className="mb-10 max-w-2xl">
          <p className="eyebrow">Infrastructure</p>
          <h2 className="mt-3 text-3xl font-semibold text-ink">Lab Facilities</h2>
          <p className="mt-4 leading-7 text-slate-700">
            Equipped with state-of-the-art tools and equipment for RF design, simulation, measurement, and characterization.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {facilities.map((facility) => {
            const Icon = facility.icon;
            return (
              <article key={facility.title} className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-purple-50 p-3 flex-shrink-0">
                    <Icon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-ink">{facility.title}</h3>
                    <p className="mt-2 leading-6 text-slate-700">{facility.description}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Lab Culture */}
      <section className="bg-slate-50 py-16">
        <div className="section-shell">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <p className="eyebrow">Culture</p>
              <h2 className="mt-3 text-3xl font-semibold text-ink">Lab Culture & Environment</h2>
              <p className="mt-4 leading-7 text-slate-700 mb-6">
                We foster an environment of innovation, collaboration, and academic rigor where students gain practical experience through hands-on research.
              </p>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-ink">Hands-On Learning</h3>
                    <p className="mt-1 text-sm text-slate-700">Students gain practical experience through complete design cycle involvement, from conception to measurement.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                      <Lightbulb className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-ink">Innovation-Driven</h3>
                    <p className="mt-1 text-sm text-slate-700">Encouraged to push boundaries, think creatively, and explore novel solutions to challenging problems.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                      <BookOpen className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-ink">Publication-Focused</h3>
                    <p className="mt-1 text-sm text-slate-700">We publish research in top-tier journals and conferences, building students' academic profiles.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                      <Award className="h-5 w-5 text-amber-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-ink">Award-Winning Work</h3>
                    <p className="mt-1 text-sm text-slate-700">Our research has received recognition through awards, gold medals, and industry partnerships.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8">
              <p className="eyebrow">Collaboration</p>
              <h3 className="mt-3 text-2xl font-semibold text-ink">Collaborative Research</h3>
              <p className="mt-4 leading-7 text-slate-700 mb-6">
                We actively collaborate with leading research groups and industry partners worldwide to advance RF microelectronics.
              </p>

              <div className="space-y-4">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900 text-sm">International Partnerships</p>
                  <p className="mt-1 text-sm text-slate-700">Collaborations with universities and research centers across Europe, Asia, and beyond.</p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900 text-sm">Industry Collaborations</p>
                  <p className="mt-1 text-sm text-slate-700">Partnerships with leading semiconductor and RF companies for technology transfer.</p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900 text-sm">Inter-Departmental Projects</p>
                  <p className="mt-1 text-sm text-slate-700">Joint research with other IIT Roorkee departments on interdisciplinary challenges.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join RISHI Lab */}
      <section className="section-shell pt-16 pb-12">
        <div className="max-w-3xl">
          <p className="eyebrow">Opportunities</p>
          <h2 className="mt-3 text-3xl font-semibold text-ink">Join RISHI Lab</h2>
          <p className="mt-4 leading-7 text-slate-700">
            We're actively seeking motivated students and researchers passionate about RF microelectronics and cutting-edge circuit design.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
            <div className="inline-block rounded-lg bg-blue-50 p-3 mb-4">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-ink">PhD Program</h3>
            <p className="mt-2 leading-6 text-slate-700 text-sm">
              Pursue doctoral research in RF microelectronics, analog circuits, or quantum applications. Full funding available for eligible candidates.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
            <div className="inline-block rounded-lg bg-green-50 p-3 mb-4">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-ink">M.Tech Projects</h3>
            <p className="mt-2 leading-6 text-slate-700 text-sm">
              Engage in semester-long or year-long projects with direct supervision. Multiple research tracks available.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
            <div className="inline-block rounded-lg bg-purple-50 p-3 mb-4">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-ink">Internships</h3>
            <p className="mt-2 leading-6 text-slate-700 text-sm">
              Gain hands-on experience with a 2-3 month intensive internship in RF design and characterization.
            </p>
          </article>
        </div>

        <a
          href="mailto:darshak.bhatt@ece.iitr.ac.in"
          className="mt-8 inline-block rounded bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Contact to Join RISHI Lab
        </a>
      </section>

      <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-500">
        <p>© 2026 Dr. Darshak Bhatt. RISHI Lab, IIT Roorkee.</p>
      </footer>
    </main>
  );
}
