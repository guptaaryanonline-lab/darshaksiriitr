import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState, useEffect } from 'react';
import rishiLogo from '../../imports/RISHI_LAB.png';
import iitRoorkeePhoto from '../../imports/IIT_Roorkee_photo.jpeg';
import iitLogo from '../../imports/IIT_logo.png';
import eceLogo from '../../imports/logo_ECE.png';
import ecePhoto from '../../imports/ECE_logo.jpeg';
import myPhoto from '../../imports/myphoto2.jpg';
import heroImage1 from '../../imports/20230827_142636.jpg';
import heroImage2 from '../../imports/20231110_210617.jpg';
import heroImage3 from '../../imports/20240314_133813.jpg';
import heroImage4 from '../../imports/20240721_174225.jpg';
import heroImage5 from '../../imports/WhatsApp_Image_2025-04-09_at_16.20.24_d80d446b.jpg';
import heroImage6 from '../../imports/20230703_143246.jpg';

export function Home() {
  const heroImages = [heroImage1, heroImage2, heroImage3, heroImage4, heroImage5, heroImage6];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);
  return (
    <div className="w-full">
      {/* Hero Section with Image Carousel */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image}
                alt={`Research ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
        </div>
        <div className="relative h-full flex items-center justify-center text-center px-6">
          <div className="max-w-4xl text-white">
            <h1 className="text-white mb-4">Dr. Darshak Bhatt</h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Associate Professor | Electronics and Communication Engineering
            </p>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              Advancing RF Microelectronics and Analog Circuit Design for Wireless,
              Quantum, and Sub-THz Applications
            </p>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* About Section with Image */}
      <section className="relative min-h-screen flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2">
          <div className="order-2 lg:order-1 p-8 md:p-16 flex items-center bg-white">
            <div>
              <h2 className="text-slate-900 mb-6">About Me</h2>
              <p className="text-slate-700 mb-4">
                I am an Associate Professor in the Department of Electronics and Communication Engineering
                at IIT Roorkee, where I lead the RISHI Lab (RF Integrated Circuit and System Innovation Lab).
              </p>
              <p className="text-slate-700 mb-4">
                My research focuses on RF Microelectronics, including analog circuits for wireless applications,
                RFIC design, transceiver design, RF front-end design for quantum and superconducting applications,
                and RF transceiver design for sub-THz applications.
              </p>
              <p className="text-slate-700 mb-4">
                I completed my PhD in RF Microelectronics from the prestigious IITB-Monash Research Academy
                in 2018, where I received the Prime Minister Fellowship. Prior to joining IIT Roorkee, I worked
                as a Senior Researcher at Carinthia University of Applied Sciences, Austria, and held research
                positions at IIT Bombay.
              </p>
              <p className="text-slate-700 mb-6">
                I am passionate about developing cutting-edge RF and analog circuits that push the boundaries
                of wireless communication and enable next-generation technologies.
              </p>
              <div className="flex gap-4">
                <a href="mailto:darshak.bhatt@ece.iitr.ac.in" className="px-6 py-3 bg-blue-600 rounded hover:bg-blue-700 transition-colors">
                  Contact Me
                </a>
                <a href="#" className="px-6 py-3 border border-slate-300  rounded hover:bg-slate-50 transition-colors">
                  Download CV
                </a>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 h-85 min-h-[30rem] lg:h-full lg:min-h-[35rem]">
            <img
              src={myPhoto}
              alt="Dr. Darshak Bhatt"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Research Highlights with IIT Background */}
      <section className="relative min-h-screen flex items-center bg-slate-900">
        <div className="absolute inset-0 opacity-20">
          <img
            src={iitRoorkeePhoto}
            alt="IIT Roorkee Campus"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative w-full px-6 md:px-16 py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-white mb-12 text-center">Research Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl text-blue-400 mb-2">20+</div>
                <div className="text-white/80">Publications</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl text-blue-400 mb-2">Multiple</div>
                <div className="text-white/80">IEEE Journals</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl text-blue-400 mb-2">PhD</div>
                <div className="text-white/80">Students</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl text-blue-400 mb-2">4</div>
                <div className="text-white/80">Gold Medals</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lab Preview */}
      <section className="relative min-h-screen flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2">
          <div className="h-96 lg:h-auto">
            <img
              src={ecePhoto}
              alt="ECE Department"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-8 md:p-16 flex items-center bg-gradient-to-br from-blue-50 to-purple-50">
            <div>
              <div className="mb-6">
                <img src={rishiLogo} alt="RISHI Lab Logo" className="h-32 w-auto" />
              </div>
              <h2 className="text-slate-900 mb-2">RISHI Lab</h2>
              <h3 className="text-slate-700 mb-6">RF Integrated Circuit and System Innovation Lab</h3>
              <p className="text-slate-700 mb-4">
                RISHI Lab is at the forefront of RF and analog integrated circuit design, developing
                innovative solutions for wireless communication, quantum computing, and sub-THz systems.
              </p>
              <p className="text-slate-700 mb-6">
                Our research spans from fundamental circuit design to system-level implementations,
                with a focus on low-power, high-performance RF front-ends for emerging applications.
              </p>
              <div className="space-y-3 text-slate-700 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Cutting-edge RFIC Design Tools</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>State-of-the-art Measurement Equipment</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>International Collaborations</span>
                </div>
              </div>
              <button className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                Explore RISHI Lab
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Achievements */}
      <section className="bg-white py-16 px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-slate-900 mb-12 text-center">Recent Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 rounded-lg p-6">
              <div className="text-blue-600 mb-2">2025</div>
              <h3 className="text-slate-900 mb-3">Promoted to Associate Professor</h3>
              <p className="text-slate-700">
                Promoted to Associate Professor at IIT Roorkee, recognizing contributions to RF microelectronics research
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-6">
              <div className="text-blue-600 mb-2">2023</div>
              <h3 className="text-slate-900 mb-3">IEEE Conference Publications</h3>
              <p className="text-slate-700">
                Multiple papers accepted at prestigious IEEE conferences including ISCAS and IWCMC
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-6">
              <div className="text-blue-600 mb-2">2013</div>
              <h3 className="text-slate-900 mb-3">Prime Minister Fellowship</h3>
              <p className="text-slate-700">
                Awarded prestigious Prime Minister Fellowship by IITB-Monash Research Academy
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative h-96 flex items-center justify-center">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1580982330720-bd5e0fed108b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxjb21wdXRlciUyMHNjaWVuY2UlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc3NzAzMTQxNXww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Technology workspace"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative text-center px-6">
          <h2 className="text-white mb-6">Interested in Joining RISHI Lab?</h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            We are looking for motivated students and researchers passionate about
            RF microelectronics and analog circuit design.
          </p>
          <a href="mailto:darshak.bhatt@ece.iitr.ac.in" className="px-8 py-4 bg-white text-slate-900 rounded-lg hover:bg-slate-100 transition-colors inline-block">
            Get in Touch
          </a>
        </div>
      </section>
    </div>
  );
}
