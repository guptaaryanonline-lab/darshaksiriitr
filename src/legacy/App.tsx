import { useState } from 'react';
import { Home } from './components/Home';
import { Research } from './components/Research';
import { Projects } from './components/Projects';
import { Lab } from './components/Lab';
import { Publications } from './components/Publications';
import { Teaching } from './components/Teaching';
import { Contact } from './components/Contact';
import iitLogo from '../imports/IIT_logo.png';
import eceLogo from '../imports/logo_ECE.png';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');

  const sections = [
    { id: 'home', label: 'Home', component: Home },
    { id: 'research', label: 'Research', component: Research },
    { id: 'projects', label: 'Projects', component: Projects },
    { id: 'lab', label: 'Lab', component: Lab },
    { id: 'publications', label: 'Publications', component: Publications },
    { id: 'teaching', label: 'Teaching', component: Teaching },
    { id: 'contact', label: 'Contact', component: Contact },
  ];

  const ActiveComponent = sections.find(s => s.id === activeSection)?.component || Home;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* IIT Roorkee Logo - Left */}
            <div className="flex-shrink-0">
              <img src={iitLogo} alt="IIT Roorkee" className="h-12 w-auto" />
            </div>

            {/* Center Content */}
            <div className="flex-1 flex items-center justify-between gap-4">
              <div className="cursor-pointer" onClick={() => setActiveSection('home')}>
                <h1 className="text-slate-900">Dr. Darshak Bhatt</h1>
                <p className="text-slate-600 hidden md:block">Associate Professor, Electronics and Communication Engineering</p>
                <p className="text-slate-600 md:hidden">Associate Professor, ECE</p>
              </div>
              <nav className="hidden lg:flex gap-4">
                {sections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`px-4 py-2 rounded transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* ECE Department Logo - Right */}
            <div className="flex-shrink-0">
              <img src={eceLogo} alt="ECE Department" className="h-12 w-auto" />
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="lg:hidden mt-4 flex gap-2 overflow-x-auto pb-2">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-2 rounded whitespace-nowrap ${
                  activeSection === section.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className={activeSection === 'home' ? '' : 'max-w-6xl mx-auto px-6 py-8'}>
        <ActiveComponent />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-slate-600">
          <p>&copy; 2026 Dr. Darshak Bhatt. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}