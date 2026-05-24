export function Research() {
  const researchAreas = [
    {
      title: "RF Microelectronics & RFIC Design",
      description: "Developing high-performance RF integrated circuits for wireless communication systems, including mixers, LNAs, and complete transceiver solutions in advanced CMOS and BiCMOS technologies.",
      projects: ["Wideband Linear Mixers", "Low-Noise Transconductance Amplifiers", "Sub-Harmonic Mixer Designs"]
    },
    {
      title: "Analog Circuits for Wireless Applications",
      description: "Designing energy-efficient analog circuits for WiFi, WiMAX, 5G, and beyond. Focus on achieving high linearity, low power consumption, and excellent noise performance.",
      projects: ["N-path Direct Conversion Receivers", "Noise Cancelling Mixer Topologies", "Bulk-Injection Mixer Architectures"]
    },
    {
      title: "RF Front-End for Quantum & Superconducting Applications",
      description: "Pioneering cryogenic RFIC design for quantum computing and superconducting applications, where traditional circuit design approaches must be adapted for extreme operating conditions.",
      projects: ["Cryo-CMOS RFIC Design", "Low-Noise Amplifiers for Cryogenic Temperatures", "RF Front-End for Quantum Systems"]
    },
    {
      title: "Sub-THz Transceiver Design",
      description: "Advancing millimeter-wave and sub-THz circuit design for future wireless systems, including 5G-Advanced and 6G applications.",
      projects: ["Q-Band Mixers", "mm-Wave Linear Transceivers", "Ultra-Wideband Receiver Architectures"]
    }
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-slate-900 mb-4">Research Overview</h2>
        <p className="text-slate-700 mb-4">
          My research focuses on advancing the state-of-the-art in RF and analog integrated circuit design.
          I work at the intersection of circuit design, system architecture, and emerging applications,
          developing innovative solutions that enable next-generation wireless communication and quantum technologies.
        </p>
        <p className="text-slate-700">
          The work in RISHI Lab spans from fundamental circuit-level innovations to complete system
          implementations, with particular emphasis on achieving high performance while maintaining
          low power consumption and excellent linearity.
        </p>
      </div>

      <div className="space-y-6">
        {researchAreas.map((area, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-slate-900 mb-3">{area.title}</h3>
            <p className="text-slate-700 mb-4">{area.description}</p>
            <div>
              <div className="text-slate-600 mb-2">Key Research Topics:</div>
              <ul className="list-disc list-inside space-y-1">
                {area.projects.map((project, idx) => (
                  <li key={idx} className="text-slate-700">{project}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-slate-900 mb-3">Research Collaborations</h3>
        <div className="space-y-2 text-slate-700">
          <p>• Yokohama University, Japan - Cryo CMOS RFIC Design</p>
          <p>• Carinthia University of Applied Sciences, Austria - RF Front-End Design</p>
          <p>• IIT Bombay, India - Advanced RFIC Research</p>
          <p>• Monash University, Australia - Mixer and LNA Topologies</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-8">
        <h3 className="text-slate-900 mb-4">Join Our Research</h3>
        <p className="text-slate-700 mb-6">
          RISHI Lab welcomes motivated PhD students, postdoctoral researchers, and visiting scholars
          interested in RF/analog IC design. We offer opportunities to work on cutting-edge projects
          with access to state-of-the-art design tools and measurement facilities.
        </p>
        <a href="mailto:darshak.bhatt@ece.iitr.ac.in" className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors inline-block">
          Contact for Research Opportunities
        </a>
      </div>
    </div>
  );
}
