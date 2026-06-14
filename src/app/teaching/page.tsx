import { SiteHeader } from "@/components/site-header";

export const metadata = {
  title: "Teaching | Dr. Darshak Bhatt | RISHI Lab",
  description: "Courses taught, student supervision, and teaching resources from Dr. Darshak Bhatt."
};

const courses = [
  {
    code: "ECN-554",
    title: "Microwave and Millimeter Wave Circuits",
    term: "Autumn Semester",
    level: "Postgraduate",
    description:
      "Advanced course covering microwave and mm-wave circuit design principles, transmission line theory, S-parameters, matching networks, and active/passive microwave components.",
    topics: ["Transmission Line Theory", "S-Parameter Analysis", "Microwave Amplifier Design", "Oscillator Design", "Mixer and Frequency Converter Design"]
  },
  {
    code: "ECN-333",
    title: "Microwave Engineering",
    term: "Spring Semester",
    level: "Undergraduate",
    description:
      "Fundamental course introducing students to microwave theory and applications, covering waveguides, resonators, microwave networks, and basic microwave components.",
    topics: ["Maxwell's Equations for Microwaves", "Waveguide Theory", "Microwave Network Analysis", "Cavity Resonators", "Microwave Measurements"]
  },
  {
    code: "ECN-556",
    title: "RF System Design and Analysis",
    term: "Spring Semester",
    level: "Postgraduate",
    description:
      "Comprehensive course on RF system design covering receiver and transmitter architectures, link budget analysis, noise figure calculations, and nonlinear system analysis.",
    topics: ["Receiver Architectures", "Transmitter Design", "Link Budget Analysis", "Noise and Linearity in RF Systems", "RF System Specifications"]
  }
];

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

export default function TeachingPage() {
  return (
    <main>
      <SiteHeader />

      <section className="section-shell pt-8">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-xl font-semibold text-ink">Teaching Philosophy</h1>
          <p className="mt-4 leading-7 text-slate-700">
            I believe in combining rigorous theoretical foundations with practical, hands-on learning experiences. My courses emphasize both analytical understanding and design intuition,
            preparing students to tackle real-world RF and microwave engineering challenges.
          </p>
          <p className="mt-4 leading-7 text-slate-700">
            I encourage students to connect classroom concepts with cutting-edge research through projects, simulations using industry-standard tools, and exposure to current literature in the field.
          </p>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold text-ink">Courses Taught</h2>
          <div className="mt-6 space-y-5">
            {courses.map((course) => (
              <article key={course.code} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
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
                    {course.topics.map((topic) => (
                      <span key={topic} className="rounded bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <section className="mt-10 rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
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

        <section className="mt-6 grid gap-5 md:grid-cols-2">
          <article className="rounded-lg border border-blue-200 bg-blue-50 p-6">
            <h3 className="font-semibold text-ink">For Prospective PhD Students</h3>
            <p className="mt-3 leading-7 text-slate-700">
              I welcome applications from motivated students with strong backgrounds in electronics, microwave engineering, or RF design. Familiarity with circuit simulation tools
              (Cadence, ADS) is advantageous.
            </p>
            <a href="mailto:darshak.bhatt@ece.iitr.ac.in" className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:underline">
              Contact for PhD Opportunities
            </a>
          </article>

          <article className="rounded-lg border border-green-200 bg-green-50 p-6">
            <h3 className="font-semibold text-ink">For B.Tech/M.Tech Projects</h3>
            <p className="mt-3 leading-7 text-slate-700">
              IIT Roorkee students interested in pursuing projects related to RF/analog IC design are encouraged to reach out. Projects range from circuit design to system-level implementations.
            </p>
            <a href="mailto:darshak.bhatt@ece.iitr.ac.in" className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:underline">
              Inquire About Project Topics
            </a>
          </article>
        </section>

        <section className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-6 sm:p-8">
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

      <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-500">
        <p>© 2026 Dr. Darshak Bhatt. All rights reserved.</p>
      </footer>
    </main>
  );
}
