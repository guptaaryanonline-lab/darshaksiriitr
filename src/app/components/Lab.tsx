import { ImageWithFallback } from './figma/ImageWithFallback';
import rishiLogo from '../../imports/RISHI_LAB.png';

export function Lab() {
  const facilities = [
    {
      name: "Advanced RFIC Design Tools",
      description: "Cadence Virtuoso, Keysight ADS, and other industry-standard tools for RF circuit design and simulation",
      icon: "🔧"
    },
    {
      name: "High-Frequency Measurement Equipment",
      description: "Vector network analyzers, spectrum analyzers, and signal generators for characterization up to mm-wave frequencies",
      icon: "📡"
    },
    {
      name: "Cryogenic Testing Facility",
      description: "Equipment for testing RF circuits at cryogenic temperatures for quantum computing applications",
      icon: "❄️"
    },
    {
      name: "PCB Fabrication & Assembly",
      description: "In-house capabilities for rapid prototyping and testing of RF circuit boards",
      icon: "⚡"
    }
  ];

  const researchFocus = [
    {
      area: "Mixer Design",
      topics: ["Gilbert Cell Mixers", "Folded Mixers", "Subharmonic Mixers", "Noise Cancelling Mixers"]
    },
    {
      area: "LNA Design",
      topics: ["Ultra-Wideband LNAs", "Cryogenic LNAs", "Low-Power LNTAs", "Multi-Band LNAs"]
    },
    {
      area: "Receiver Architectures",
      topics: ["Direct Conversion Receivers", "N-path Receivers", "Low-IF Receivers", "Superheterodyne Receivers"]
    },
    {
      area: "Advanced Applications",
      topics: ["Quantum Computing RF Front-Ends", "Sub-THz Transceivers", "5G/6G Circuits", "IoT Radios"]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Lab Header with Logo */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
          <img src={rishiLogo} alt="RISHI Lab Logo" className="h-40 w-auto" />
          <div>
            <h2 className="text-slate-900 mb-2">RISHI Lab</h2>
            <h3 className="text-blue-600 mb-4">RF Integrated Circuit and System Innovation Lab</h3>
            <p className="text-slate-700">
              Department of Electronics and Communication Engineering<br />
              Indian Institute of Technology Roorkee
            </p>
          </div>
        </div>
        <p className="text-slate-700 mb-4">
          RISHI Lab is dedicated to advancing the frontiers of RF and analog integrated circuit design.
          Our research addresses fundamental challenges in wireless communication, quantum computing,
          and emerging sub-THz applications.
        </p>
        <p className="text-slate-700">
          We combine theoretical innovation with practical implementation, developing circuits that
          push the boundaries of performance while maintaining energy efficiency and manufacturability.
        </p>
      </div>

      {/* Lab Photo */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="h-96">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1602052294200-a8b75e03adfe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwcmVzZWFyY2glMjBsYWJvcmF0b3J5fGVufDF8fHx8MTc3NzAzMTQxNHww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="RISHI Laboratory"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Research Focus Areas */}
      <div>
        <h3 className="text-slate-900 mb-6">Research Focus Areas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {researchFocus.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <h4 className="text-slate-900 mb-3">{item.area}</h4>
              <ul className="space-y-2">
                {item.topics.map((topic, idx) => (
                  <li key={idx} className="text-slate-700 flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Facilities */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h3 className="text-slate-900 mb-6">Lab Facilities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {facilities.map((facility, index) => (
            <div key={index} className="border border-slate-200 rounded-lg p-6">
              <div className="text-4xl mb-3">{facility.icon}</div>
              <h4 className="text-slate-900 mb-2">{facility.name}</h4>
              <p className="text-slate-700">{facility.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Collaborations */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h3 className="text-slate-900 mb-6">International Collaborations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-l-4 border-blue-600 pl-4">
            <h4 className="text-slate-900 mb-2">Yokohama University, Japan</h4>
            <p className="text-slate-700">Collaborative research on Cryo-CMOS RFIC design for quantum computing applications</p>
          </div>
          <div className="border-l-4 border-blue-600 pl-4">
            <h4 className="text-slate-900 mb-2">Carinthia University, Austria</h4>
            <p className="text-slate-700">RF front-end design and advanced microwave circuits</p>
          </div>
          <div className="border-l-4 border-blue-600 pl-4">
            <h4 className="text-slate-900 mb-2">IIT Bombay, India</h4>
            <p className="text-slate-700">Joint research initiatives in RFIC design and wireless systems</p>
          </div>
          <div className="border-l-4 border-blue-600 pl-4">
            <h4 className="text-slate-900 mb-2">Monash University, Australia</h4>
            <p className="text-slate-700">Mixer and LNA topologies for wideband wireless systems</p>
          </div>
        </div>
      </div>

      {/* Lab Culture */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8">
        <h3 className="text-slate-900 mb-4">Lab Culture & Environment</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-slate-900 mb-3">Innovation-Driven</h4>
            <p className="text-slate-700">
              We encourage creative thinking and novel approaches to circuit design challenges.
              Every team member is empowered to explore new ideas and push technological boundaries.
            </p>
          </div>
          <div>
            <h4 className="text-slate-900 mb-3">Collaborative Research</h4>
            <p className="text-slate-700">
              RISHI Lab fosters a collaborative environment where students, postdocs, and faculty
              work together on interdisciplinary projects with global research partners.
            </p>
          </div>
          <div>
            <h4 className="text-slate-900 mb-3">Hands-On Learning</h4>
            <p className="text-slate-700">
              Students gain practical experience through complete design cycles - from circuit
              conception to fabrication, testing, and publication of results.
            </p>
          </div>
          <div>
            <h4 className="text-slate-900 mb-3">Industry Relevance</h4>
            <p className="text-slate-700">
              Our research addresses real-world challenges in wireless communication, ensuring
              that lab innovations translate to practical applications and industry impact.
            </p>
          </div>
        </div>
      </div>

      {/* Join the Lab */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h3 className="text-slate-900 mb-4">Join RISHI Lab</h3>
        <p className="text-slate-700 mb-6">
          We are always looking for passionate researchers and students interested in RF/analog IC design:
        </p>
        <div className="space-y-4 mb-6">
          <div className="border-l-4 border-blue-600 pl-4">
            <h4 className="text-slate-900 mb-1">PhD Scholars</h4>
            <p className="text-slate-700">
              Apply through IIT Roorkee PhD admissions. Strong background in electronics and circuit design preferred.
              Prior experience with RF simulation tools is a plus.
            </p>
          </div>
          <div className="border-l-4 border-blue-600 pl-4">
            <h4 className="text-slate-900 mb-1">M.Tech Students</h4>
            <p className="text-slate-700">
              M.Tech students at IIT Roorkee can pursue thesis work in RISHI Lab. Multiple project topics available
              in mixer design, LNA design, and receiver architectures.
            </p>
          </div>
          <div className="border-l-4 border-blue-600 pl-4">
            <h4 className="text-slate-900 mb-1">B.Tech Projects</h4>
            <p className="text-slate-700">
              Undergraduate students can work on semester projects or final year projects related to RF circuits,
              simulation, and system design.
            </p>
          </div>
          <div className="border-l-4 border-blue-600 pl-4">
            <h4 className="text-slate-900 mb-1">Visiting Researchers</h4>
            <p className="text-slate-700">
              We welcome visiting scholars and postdoctoral researchers for collaborative research stays.
              Please contact with your research proposal and timeline.
            </p>
          </div>
        </div>
        <a href="mailto:darshak.bhatt@ece.iitr.ac.in" className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors inline-block">
          Contact to Join RISHI Lab
        </a>
      </div>
    </div>
  );
}
