import { ImageWithFallback } from './figma/ImageWithFallback';

export function Projects() {
  const projects = [
    {
      title: "Ultra-Wideband N-Path Direct Conversion Receiver",
      status: "Active",
      duration: "2022-Present",
      image: "https://images.unsplash.com/photo-1624953587687-daf255b6b80a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxjb21wdXRlciUyMHNjaWVuY2UlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc3NzAzMTQxNXww&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Development of low-noise N-path direct conversion receiver architecture for 5G-Advanced and 6G wireless systems. The design achieves ultra-wideband operation with excellent noise performance and high linearity.",
      objectives: ["Achieve sub-3dB noise figure across wide bandwidth", "Minimize LO leakage and image rejection", "Enable reconfigurable multi-band operation"],
      publications: 1,
      impact: "Published at IEEE ISCAS 2023"
    },
    {
      title: "Cryogenic RFIC for Quantum Computing",
      status: "Active",
      duration: "2021-Present",
      image: "https://images.unsplash.com/photo-1562411053-1d8bdfe771c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHx1bml2ZXJzaXR5JTIwcmVzZWFyY2glMjBsYWJvcmF0b3J5fGVufDF8fHx8MTc3NzAzMTQxNHww&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Design of low-noise transconductance amplifiers (LNTA) and RF front-end circuits operating at cryogenic temperatures for quantum computing applications. Collaboration with Yokohama University, Japan.",
      objectives: ["Design CMOS circuits for 4K operation", "Minimize power dissipation for cryo-cooling", "Achieve high gain and low noise at cryogenic temperatures"],
      publications: 1,
      impact: "Presented at Austrochip 2022"
    },
    {
      title: "Q-Band and mm-Wave Mixers for 5G",
      status: "Active",
      duration: "2020-Present",
      image: "https://images.unsplash.com/photo-1562411053-c9ac630a5934?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHx1bml2ZXJzaXR5JTIwcmVzZWFyY2glMjBsYWJvcmF0b3J5fGVufDF8fHx8MTc3NzAzMTQxNHww&ixlib=rb-4.1.0&q=80&w=1080",
      description: "High-isolation linear subharmonic and fundamental mixers for Q-band (33-50 GHz) and mm-wave (17-32 GHz) applications in 5G communication systems. Focus on achieving high linearity and low LO-RF isolation.",
      objectives: ["Design wideband mm-wave mixers", "Achieve high conversion gain and linearity", "Minimize LO power requirements"],
      publications: 2,
      impact: "Published at IEEE IWCMC 2023 and LAMC 2020"
    },
    {
      title: "Wideband Noise Cancelling Mixer Design",
      status: "Completed",
      duration: "2021-2022",
      image: "https://images.unsplash.com/photo-1602052577122-f73b9710adba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHx1bml2ZXJzaXR5JTIwcmVzZWFyY2glMjBsYWJvcmF0b3J5fGVufDF8fHx8MTc3NzAzMTQxNHww&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Development of novel noise cancelling mixer topology in 130-nm BiCMOS process achieving wideband operation with superior noise performance compared to conventional Gilbert cell mixers.",
      objectives: ["Implement noise cancellation technique", "Achieve low noise figure across wide bandwidth", "Maintain high linearity and gain"],
      publications: 1,
      impact: "Published at IEEE MAPCON 2022"
    },
    {
      title: "GPS Receiver Front-End System Analysis",
      status: "Completed",
      duration: "2021-2022",
      image: "https://images.unsplash.com/photo-1758270704587-43339a801396?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxhY2FkZW1pYyUyMHByb2Zlc3NvciUyMHRlYWNoaW5nfGVufDF8fHx8MTc3NzAzMTQxNXww&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Comprehensive system-level analysis and architectural survey of GPS receiver front-ends, including receiver topologies, performance metrics, and design trade-offs.",
      objectives: ["Analyze GPS receiver architectures", "Compare different front-end topologies", "Provide design guidelines for GPS receivers"],
      publications: 1,
      impact: "Published in IEEE Access journal"
    },
    {
      title: "Low-Power Mixer and LNA for WiFi/WiMAX",
      status: "Completed",
      duration: "2016-2018",
      image: "https://images.unsplash.com/photo-1580982330720-bd5e0fed108b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxjb21wdXRlciUyMHNjaWVuY2UlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc3NzAzMTQxNXww&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Switched transconductance mixer and LNA design optimized for WiFi and WiMAX applications in 65-nm CMOS. Part of PhD thesis work focusing on low-power wireless receiver design.",
      objectives: ["Minimize power consumption", "Achieve high linearity for WiFi standards", "Reduce parasitic signal feedthrough"],
      publications: 2,
      impact: "Published in IET MAP journal and PhD thesis"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-slate-900 mb-4">Research Projects</h2>
        <p className="text-slate-700">
          RISHI Lab pursues fundamental and applied research in RF integrated circuit design.
          Our projects span from novel circuit topologies to complete system implementations,
          addressing challenges in next-generation wireless communication and emerging quantum technologies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="text-3xl text-green-600 mb-2">6</div>
          <div className="text-slate-700">Major Projects</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <div className="text-3xl text-blue-600 mb-2">3</div>
          <div className="text-slate-700">Active Projects</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
          <div className="text-3xl text-purple-600 mb-2">8+</div>
          <div className="text-slate-700">Publications</div>
        </div>
      </div>

      {projects.map((project, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-1 h-64 lg:h-auto">
              <ImageWithFallback
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="lg:col-span-2 p-6 md:p-8">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-slate-900 flex-1">{project.title}</h3>
                <span className={`px-3 py-1 rounded text-sm ml-4 ${
                  project.status === 'Active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {project.status}
                </span>
              </div>

              <p className="text-slate-700 mb-4">{project.description}</p>

              <div className="mb-4">
                <div className="text-slate-600 mb-1">Duration</div>
                <div className="text-slate-900">{project.duration}</div>
              </div>

              <div className="mb-4">
                <div className="text-slate-600 mb-2">Key Objectives</div>
                <ul className="space-y-1">
                  {project.objectives.map((obj, idx) => (
                    <li key={idx} className="text-slate-700 flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-6 mb-4">
                <div>
                  <span className="text-slate-600">Publications: </span>
                  <span className="text-slate-900">{project.publications}</span>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                <div className="text-slate-600 mb-1">Impact</div>
                <div className="text-slate-900">{project.impact}</div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-8">
        <h3 className="text-slate-900 mb-4">Collaborative Research Opportunities</h3>
        <p className="text-slate-700 mb-6">
          RISHI Lab welcomes collaborations with industry partners, research institutions,
          and fellow academics. We are particularly interested in projects involving:
        </p>
        <ul className="space-y-2 text-slate-700 mb-6">
          <li>• Advanced wireless communication systems (5G/6G)</li>
          <li>• Quantum computing RF front-end design</li>
          <li>• Sub-THz and mm-wave circuits</li>
          <li>• Energy-efficient RF transceivers for IoT</li>
          <li>• Novel circuit topologies and architectures</li>
        </ul>
        <a href="mailto:darshak.bhatt@ece.iitr.ac.in" className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors inline-block">
          Discuss Collaboration
        </a>
      </div>
    </div>
  );
}
