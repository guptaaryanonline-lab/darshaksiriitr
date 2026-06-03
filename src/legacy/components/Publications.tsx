export function Publications() {
  const publications = [
    {
      year: 2023,
      items: [
        {
          title: "A High Isolation Linear Subharmonic Mixer for Q-Band Application",
          authors: "Srivastava G, Bhatt D",
          venue: "2023 International Wireless Communications and Mobile Computing (IWCMC), pp. 1395-1399",
          type: "Conference",
          publisher: "IEEE"
        },
        {
          title: "Ultra Wideband Low Noise N-path Direct Conversion Receiver for 5G-advanced and 6G Wireless System",
          authors: "Kumari A, Bhatt D",
          venue: "2023 IEEE International Symposium on Circuits and Systems (ISCAS)",
          type: "Conference",
          publisher: "IEEE"
        }
      ]
    },
    {
      year: 2022,
      items: [
        {
          title: "A Wideband Noise Cancelling Mixer in 130-nm BiCMOS Process",
          authors: "Guruprakashkumar P, Bhatt D",
          venue: "2022 IEEE Microwaves, Antennas, and Propagation Conference (MAPCON), pp. 1461-1465",
          type: "Conference",
          publisher: "IEEE"
        },
        {
          title: "A Low-Noise Transconductance Amplifier (LNTA) for Cryogenic Applications using CMOS Technology",
          authors: "Kamparaju G, Bhatt D",
          venue: "2022 Austrochip Workshop on Microelectronics (Austrochip), pp. 61-64",
          type: "Conference",
          publisher: "IEEE"
        },
        {
          title: "Advanced System Analysis and Survey on the GPS Receiver Front End",
          authors: "Kumari A, Bhatt D",
          venue: "IEEE Access",
          type: "Journal",
          publisher: "IEEE"
        }
      ]
    },
    {
      year: 2021,
      items: [
        {
          title: "A 17-32 GHz Wideband High Isolation Linear mm-Wave Mixer For 5G applications",
          authors: "Srivastava G, Bhatt D",
          venue: "2020 IEEE MTT-S Latin America Microwave Conference (LAMC 2020)",
          type: "Conference",
          publisher: "IEEE"
        }
      ]
    },
    {
      year: 2019,
      items: [
        {
          title: "Design of Wideband Active Mixer by using an Active Inductor",
          authors: "Bhatt D",
          venue: "2019 IEEE Asia-Pacific Microwave Conference (APMC), pp. 1173-1175",
          type: "Conference",
          publisher: "IEEE"
        }
      ]
    },
    {
      year: 2018,
      items: [
        {
          title: "Study and Design of Integrated Mixer and LNA Topologies for WiFi and Wideband Systems with a High Immunity to Parasitic Signal Feedthrough",
          authors: "Bhatt DK",
          venue: "PhD Thesis, Monash University",
          type: "Thesis",
          publisher: "Monash University"
        },
        {
          title: "Low-power switched transconductance mixer and LNA design for Wi-Fi and WiMAX applications in 65 nm CMOS",
          authors: "Bhatt D, Mukherjee J, Redouté JM",
          venue: "IET Microwaves, Antennas & Propagation, Vol. 12, pp. 1736-1744",
          type: "Journal",
          publisher: "IET"
        }
      ]
    },
    {
      year: 2017,
      items: [
        {
          title: "A 1-11 GHz ultra-wideband LNA using M-derived inductive peaking circuit in UMC 65 nm CMOS",
          authors: "Bhatt D, Mukherjee J, Redouté JM",
          venue: "Microwave and Optical Technology Letters, Vol. 59, pp. 521-526",
          type: "Journal",
          publisher: "Wiley"
        },
        {
          title: "A Self-Biased Mixer in 0.18um CMOS for an Ultra-Wideband Receiver",
          authors: "Bhatt D, Mukherjee J, Redouté JM",
          venue: "IEEE Transactions on Microwave Theory and Techniques, Vol. 65, pp. 1294-1302",
          type: "Journal",
          publisher: "IEEE"
        },
        {
          title: "Multi Mode Resonators Based Triple Band Notch UWB Filter",
          authors: "Kamma A, Das R, Bhatt D, Mukherjee J",
          venue: "IEEE Microwave and Wireless Components Letters, Vol. 27, pp. 120-122",
          type: "Journal",
          publisher: "IEEE"
        }
      ]
    },
    {
      year: 2016,
      items: [
        {
          title: "Low-Power Linear Bulk-Injection Mixer for Wide-Band Applications",
          authors: "Bhatt D, Mukherjee J, Redouté JM",
          venue: "IEEE Microwave and Wireless Components Letters, Vol. 26, pp. 828-830",
          type: "Journal",
          publisher: "IEEE"
        },
        {
          title: "A high-isolation linear folded mixer for ISM band in UMC 180NM CMOS technology",
          authors: "Bhatt D, Mukherjee J, Redouté JM",
          venue: "Microwave and Optical Technology Letters, Vol. 58, pp. 2461-2466",
          type: "Journal",
          publisher: "Wiley"
        }
      ]
    },
    {
      year: 2014,
      items: [
        {
          title: "A high isolation linear folded mixer for WiFi applications",
          authors: "Bhatt D, Mukherjee J, Redoute JM",
          venue: "2014 IEEE International Symposium on Circuits and Systems (ISCAS), pp. 694-697",
          type: "Conference",
          publisher: "IEEE"
        }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-slate-900 mb-4">Publications</h2>
        <p className="text-slate-700 mb-4">
          My research has been published in prestigious IEEE journals and international conferences,
          focusing on RF/analog integrated circuit design and wireless communication systems.
        </p>
        <div className="flex flex-wrap gap-6 text-slate-700">
          <div>
            <span className="text-slate-600">Total Publications:</span> 20+
          </div>
          <div>
            <span className="text-slate-600">IEEE Journals:</span> Multiple
          </div>
          <div>
            <span className="text-slate-600">Conference Papers:</span> 10+
          </div>
        </div>
        <div className="mt-4">
          <a href="https://scholar.google.com/citations?hl=en&user=XOKWdPAAAAAJ" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            View Google Scholar Profile →
          </a>
        </div>
      </div>

      {publications.map((yearGroup) => (
        <div key={yearGroup.year}>
          <h3 className="text-slate-900 mb-4">{yearGroup.year}</h3>
          <div className="space-y-4">
            {yearGroup.items.map((pub, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1">
                    <h4 className="text-slate-900 mb-2">{pub.title}</h4>
                    <p className="text-slate-600 mb-2">{pub.authors}</p>
                    <p className="text-slate-500 mb-1">{pub.venue}</p>
                    {pub.publisher && (
                      <p className="text-slate-400">{pub.publisher}</p>
                    )}
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm flex-shrink-0">
                    {pub.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-8">
        <h3 className="text-slate-900 mb-4">Research Areas</h3>
        <p className="text-slate-700 mb-4">My publications cover the following key areas:</p>
        <ul className="space-y-2 text-slate-700">
          <li>• RF Mixer Design (Gilbert cell, folded, subharmonic topologies)</li>
          <li>• Low-Noise Amplifier (LNA) Design for UWB and specific bands</li>
          <li>• Direct Conversion Receivers and N-path filters</li>
          <li>• Cryogenic RF circuits for quantum applications</li>
          <li>• mm-Wave and Sub-THz transceiver components</li>
          <li>• Power-efficient analog circuits for wireless systems</li>
        </ul>
      </div>
    </div>
  );
}
