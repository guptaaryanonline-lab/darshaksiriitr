import { SiteHeader } from "@/components/site-header";
import { Mail, MapPin, Phone, Linkedin, Globe } from "lucide-react";

export const metadata = {
  title: "Contact | Dr. Darshak Bhatt | RISHI Lab",
  description: "Get in touch with RISHI Lab for collaborations, inquiries, or research opportunities."
};

export default function ContactPage() {
  return (
    <main>
      <SiteHeader />

      <section className="section-shell pt-8">
        <div className="max-w-3xl">
          <p className="eyebrow">Let's Connect</p>
          <h1 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">Get in Touch</h1>
          <p className="mt-4 leading-7 text-slate-700">
            Interested in collaboration, research partnerships, or have questions about our work? We'd love to hear from you.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition">
            <div className="rounded-lg bg-blue-50 w-fit p-3 mb-4">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-ink">Email</h3>
            <p className="mt-2 leading-7 text-slate-700">For general inquiries and research collaboration</p>
            <a href="mailto:darshak.bhatt@ece.iitr.ac.in" className="mt-4 inline-block font-semibold text-navy hover:text-ink">
              darshak.bhatt@ece.iitr.ac.in
            </a>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition">
            <div className="rounded-lg bg-cyan-50 w-fit p-3 mb-4">
              <MapPin className="h-6 w-6 text-cyan-600" />
            </div>
            <h3 className="text-lg font-semibold text-ink">Address</h3>
            <p className="mt-2 leading-7 text-slate-700">
              RISHI Lab, Department of Electronics and Communication Engineering, IIT Roorkee, Roorkee, India
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition">
            <div className="rounded-lg bg-purple-50 w-fit p-3 mb-4">
              <Linkedin className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-ink">Connect Online</h3>
            <p className="mt-2 leading-7 text-slate-700">Follow our work and connect on professional networks</p>
            <a href="https://scholar.google.com/citations?hl=en&user=XOKWdPAAAAAJ" target="_blank" rel="noopener noreferrer" className="mt-4 inline-block font-semibold text-navy hover:text-ink">
              Google Scholar
            </a>
          </article>
        </div>
      </section>

      <section className="section-shell mt-16 grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <h2 className="text-2xl font-semibold text-ink mb-6">Research Collaboration</h2>
          <div className="space-y-4 text-slate-700">
            <p>
              <strong>Industry Partnerships:</strong> We offer research opportunities, sponsored projects, and technology transfer for industry partners.
            </p>
            <p>
              <strong>Academic Collaboration:</strong> Interested in collaborative research with other academic institutions? Let's explore mutual opportunities.
            </p>
            <p>
              <strong>Student Projects:</strong> PhD scholars, M.Tech students, and interns welcome. Contact us for ongoing research projects and openings.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <h2 className="text-2xl font-semibold text-ink mb-6">Lab Facilities</h2>
          <div className="space-y-4 text-slate-700">
            <p>
              <strong>Design Tools:</strong> Access to industry-standard RFIC design tools, CAD software, and simulation platforms.
            </p>
            <p>
              <strong>Measurement Equipment:</strong> State-of-the-art RF measurement and characterization equipment.
            </p>
            <p>
              <strong>Collaborative Workspace:</strong> Modern lab facilities designed for collaborative research and innovation.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="section-shell max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-ink">Visit IIT Roorkee</h2>
          <p className="mt-4 leading-7 text-slate-700">
            Located in Roorkee, Uttarakhand, IIT Roorkee is one of India's premier engineering institutions. Learn more about visiting our campus or scheduling a lab tour.
          </p>
          <a
            href="https://iitr.ac.in"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Visit IIT Roorkee
          </a>
        </div>
      </section>

      <section className="section-shell py-12">
        <div className="rounded-2xl bg-gradient-to-r from-navy to-cyan-600 text-white p-8 sm:p-10 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold">Ready to explore opportunities?</h2>
          <p className="mt-3 leading-7 text-slate-100">
            Drop us an email or visit our lab. We're excited to discuss collaborations, research partnerships, and student projects.
          </p>
          <a href="mailto:darshak.bhatt@ece.iitr.ac.in" className="mt-6 inline-block rounded bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
            Send an Email
          </a>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-500">
        <p>© 2026 Dr. Darshak Bhatt. RISHI Lab, IIT Roorkee.</p>
      </footer>
    </main>
  );
}
