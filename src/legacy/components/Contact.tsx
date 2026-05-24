export function Contact() {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-slate-900 mb-6">Get in Touch</h2>
        <p className="text-slate-700 mb-8">
          I welcome inquiries from prospective students, research collaborators, and industry partners.
          Feel free to reach out through any of the channels below.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-slate-900 mb-4">Contact Information</h3>
            <div className="space-y-3 text-slate-700">
              <div>
                <div className="text-slate-600">Email</div>
                <a href="mailto:darshak.bhatt@ece.iitr.ac.in" className="text-blue-600 hover:underline">
                  darshak.bhatt@ece.iitr.ac.in
                </a>
              </div>
              <div>
                <div className="text-slate-600">Department</div>
                <div>Electronics and Communication Engineering</div>
              </div>
              <div>
                <div className="text-slate-600">Institution</div>
                <div>Indian Institute of Technology Roorkee</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-slate-900 mb-4">Mailing Address</h3>
            <div className="text-slate-700 mb-6">
              Dr. Darshak Bhatt<br />
              Department of Electronics and Communication Engineering<br />
              Indian Institute of Technology Roorkee<br />
              Roorkee, Uttarakhand 247667<br />
              India
            </div>

            <h3 className="text-slate-900 mb-4">Online Profiles</h3>
            <div className="space-y-2">
              <a href="https://scholar.google.com/citations?hl=en&user=XOKWdPAAAAAJ" target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:underline">
                Google Scholar
              </a>
              <a href="https://iitr.ac.in/Departments/Electronics%20and%20Communication%20Engineering%20Department/People/Faculty/100822.html" target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:underline">
                IIT Roorkee Faculty Page
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-slate-900 mb-3">For Prospective Students</h3>
          <p className="text-slate-700 mb-4">
            <strong>PhD Admissions:</strong> Apply through IIT Roorkee's regular admission process.
            Mention my name in your application if you're interested in RF microelectronics research.
          </p>
          <p className="text-slate-700 mb-4">
            <strong>M.Tech/B.Tech Projects:</strong> IIT Roorkee students can directly contact me
            for project opportunities in RISHI Lab.
          </p>
          <a href="mailto:darshak.bhatt@ece.iitr.ac.in?subject=Student%20Inquiry" className="text-blue-600 hover:underline">
            Send Student Inquiry →
          </a>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-slate-900 mb-3">For Researchers & Collaborators</h3>
          <p className="text-slate-700 mb-4">
            I'm open to collaborative research opportunities in RF/analog IC design,
            joint publications, and industry-academia partnerships.
          </p>
          <p className="text-slate-700 mb-4">
            Visiting researchers and postdoctoral scholars are welcome to discuss
            research stays at RISHI Lab.
          </p>
          <a href="mailto:darshak.bhatt@ece.iitr.ac.in?subject=Research%20Collaboration" className="text-blue-600 hover:underline">
            Discuss Collaboration →
          </a>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <h3 className="text-slate-900 mb-4">Send a Message</h3>
        <form className="space-y-4">
          <div>
            <label className="block text-slate-700 mb-2">Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-slate-700 mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your.email@example.com"
            />
          </div>
          <div>
            <label className="block text-slate-700 mb-2">Subject</label>
            <select className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>PhD Admission Inquiry</option>
              <option>M.Tech/B.Tech Project</option>
              <option>Research Collaboration</option>
              <option>Postdoctoral Position</option>
              <option>Industry Partnership</option>
              <option>General Inquiry</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-700 mb-2">Message</label>
            <textarea
              rows={6}
              className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your message..."
            ></textarea>
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Send Message
          </button>
        </form>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-slate-900 mb-2">RISHI Lab</h3>
        <p className="text-slate-700 mb-3">
          RF Integrated Circuit and System Innovation Lab
        </p>
        <p className="text-slate-700">
          For lab-specific inquiries, research updates, or to schedule a visit to our facilities,
          please mention "RISHI Lab" in your message subject line.
        </p>
      </div>
    </div>
  );
}
