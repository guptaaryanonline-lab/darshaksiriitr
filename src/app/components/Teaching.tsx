export function Teaching() {
  const courses = [
    {
      code: "ECN-554",
      title: "Microwave and Millimeter Wave Circuits",
      term: "Autumn Semester",
      level: "Postgraduate",
      description: "Advanced course covering microwave and mm-wave circuit design principles, transmission line theory, S-parameters, matching networks, and active/passive microwave components.",
      topics: ["Transmission Line Theory", "S-Parameter Analysis", "Microwave Amplifier Design", "Oscillator Design", "Mixer and Frequency Converter Design"]
    },
    {
      code: "ECN-333",
      title: "Microwave Engineering",
      term: "Spring Semester",
      level: "Undergraduate",
      description: "Fundamental course introducing students to microwave theory and applications, covering waveguides, resonators, microwave networks, and basic microwave components.",
      topics: ["Maxwell's Equations for Microwaves", "Waveguide Theory", "Microwave Network Analysis", "Cavity Resonators", "Microwave Measurements"]
    },
    {
      code: "ECN-556",
      title: "RF System Design and Analysis",
      term: "Spring Semester",
      level: "Postgraduate",
      description: "Comprehensive course on RF system design covering receiver and transmitter architectures, link budget analysis, noise figure calculations, and nonlinear system analysis.",
      topics: ["Receiver Architectures", "Transmitter Design", "Link Budget Analysis", "Noise and Linearity in RF Systems", "RF System Specifications"]
    }
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-slate-900 mb-4">Teaching Philosophy</h2>
        <p className="text-slate-700 mb-4">
          I believe in combining rigorous theoretical foundations with practical, hands-on learning experiences.
          My courses emphasize both analytical understanding and design intuition, preparing students to tackle
          real-world RF and microwave engineering challenges.
        </p>
        <p className="text-slate-700">
          I encourage students to connect classroom concepts with cutting-edge research through projects,
          simulations using industry-standard tools, and exposure to current literature in the field.
        </p>
      </div>

      <div>
        <h3 className="text-slate-900 mb-6">Courses Taught</h3>
        <div className="space-y-6">
          {courses.map((course, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-3 flex-wrap gap-4">
                <div>
                  <h4 className="text-slate-900">{course.code}: {course.title}</h4>
                  <div className="text-slate-600 mt-1">{course.term} • {course.level}</div>
                </div>
              </div>
              <p className="text-slate-700 mb-4">{course.description}</p>
              <div>
                <div className="text-slate-600 mb-2">Key Topics:</div>
                <div className="flex flex-wrap gap-2">
                  {course.topics.map((topic, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded text-sm">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <h3 className="text-slate-900 mb-6">Student Supervision</h3>
        <p className="text-slate-700 mb-6">
          I actively supervise PhD scholars, M.Tech students, and B.Tech projects in the areas of
          RF microelectronics, analog CMOS design, and wireless communication circuits.
        </p>

        <div className="space-y-4">
          <div>
            <h4 className="text-slate-900 mb-2">Current Research Areas for Students:</h4>
            <ul className="list-disc list-inside space-y-2 text-slate-700">
              <li>RF Front-End Design for Advanced Wireless Systems</li>
              <li>Cryogenic RFIC for Quantum Computing Applications</li>
              <li>mm-Wave and Sub-THz Circuit Design</li>
              <li>Low-Power Transceiver Architectures</li>
              <li>Noise Cancellation Techniques in RF Circuits</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-slate-900 mb-3">For Prospective PhD Students</h4>
          <p className="text-slate-700 mb-4">
            I welcome applications from motivated students with strong backgrounds in electronics,
            microwave engineering, or RF design. Familiarity with circuit simulation tools
            (Cadence, ADS) is advantageous.
          </p>
          <a href="mailto:darshak.bhatt@ece.iitr.ac.in" className="text-blue-600 hover:underline">
            Contact for PhD Opportunities →
          </a>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h4 className="text-slate-900 mb-3">For B.Tech/M.Tech Projects</h4>
          <p className="text-slate-700 mb-4">
            IIT Roorkee students interested in pursuing projects related to RF/analog IC design
            are encouraged to reach out. Projects range from circuit design to system-level
            implementations.
          </p>
          <a href="mailto:darshak.bhatt@ece.iitr.ac.in" className="text-blue-600 hover:underline">
            Inquire About Project Topics →
          </a>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-8">
        <h3 className="text-slate-900 mb-4">Teaching Resources</h3>
        <p className="text-slate-700 mb-4">
          Course materials, lecture notes, and assignments are made available to enrolled students
          through the IIT Roorkee academic portal.
        </p>
        <div className="space-y-2 text-slate-700">
          <p>• Simulation tutorials using Cadence Virtuoso and Keysight ADS</p>
          <p>• Reference material from leading IEEE journals and conferences</p>
          <p>• Industry case studies and design examples</p>
        </div>
      </div>
    </div>
  );
}
