import { PrismaClient } from "@prisma/client";
import { randomBytes, scryptSync } from "crypto";

const prisma = new PrismaClient();

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

// This script is safe to run against a live database: it NEVER deletes or
// updates content. Each section is only filled with starter content when it
// is completely empty, so running it on a database that already has real
// students, projects, publications, etc. leaves all of them untouched.
async function seedIfEmpty(label: string, count: () => Promise<number>, create: () => Promise<unknown>) {
  const existing = await count();
  if (existing > 0) {
    console.log(`[seed] ${label}: ${existing} existing rows, left untouched`);
    return;
  }
  await create();
  console.log(`[seed] ${label}: was empty, added starter content`);
}

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD || "admin12345";

  // Creates the admin account if missing; never changes an existing password.
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash: hashPassword(password)
    }
  });

  await seedIfEmpty("projects", () => prisma.project.count(), () =>
    prisma.project.createMany({
      data: [
        {
          title: "Ultra-Wideband N-Path Direct Conversion Receiver",
          status: "Active",
          duration: "2022-Present",
          image: "/images/RISHI_LAB.png",
          description:
            "Low-noise N-path receiver architecture for 5G-Advanced and 6G wireless systems with wideband operation, strong noise performance, and high linearity.",
          objectives: "Sub-3dB noise figure\nLow LO leakage\nReconfigurable multi-band operation",
          publications: 1,
          impact: "Published at IEEE ISCAS 2023",
          sortOrder: 1
        },
        {
          title: "Cryogenic RFIC for Quantum Computing",
          status: "Active",
          duration: "2021-Present",
          image: "/images/RISHI_LAB.png",
          description:
            "Low-noise transconductance amplifiers and RF front-end circuits for cryogenic quantum computing applications.",
          objectives: "CMOS circuits for 4K operation\nLow power dissipation\nHigh gain at cryogenic temperature",
          publications: 1,
          impact: "Presented at Austrochip 2022",
          sortOrder: 2
        },
        {
          title: "Q-Band and mm-Wave Mixers for 5G",
          status: "Completed",
          duration: "2020-2023",
          image: "/images/RISHI_LAB.png",
          description:
            "High-isolation linear subharmonic and fundamental mixers for Q-band and mm-wave communication systems.",
          objectives: "Wideband mixer design\nHigh conversion gain\nLow LO power requirements",
          publications: 2,
          impact: "Published at IEEE IWCMC 2023 and LAMC 2020",
          sortOrder: 3
        }
      ]
    })
  );

  await seedIfEmpty("research", () => prisma.research.count(), () =>
    prisma.research.createMany({
      data: [
        {
          title: "RF Microelectronics and RFIC Design",
          description:
            "High-performance RF integrated circuits for wireless systems, including mixers, LNAs, receivers, and transceiver blocks.",
          topics: "Wideband linear mixers\nLow-noise amplifiers\nReceiver front ends",
          sortOrder: 1
        },
        {
          title: "RF Front-End for Quantum Applications",
          description:
            "Cryogenic RFIC design for quantum and superconducting applications where circuits operate under extreme conditions.",
          topics: "Cryo-CMOS RFIC\nLow-temperature LNAs\nQuantum control interfaces",
          sortOrder: 2
        },
        {
          title: "Sub-THz Transceiver Design",
          description:
            "Millimeter-wave and sub-THz circuits for future wireless systems, including 5G-Advanced and 6G.",
          topics: "Q-band mixers\nmm-wave transceivers\nUltra-wideband receivers",
          sortOrder: 3
        }
      ]
    })
  );

  // Real publication list, taken from the original site (legacy/components/Publications.tsx).
  // DOIs are intentionally left empty: add them from the admin panel only when verified.
  await seedIfEmpty("publications", () => prisma.publication.count(), () =>
    prisma.publication.createMany({ data: realPublications })
  );

  // Placeholder rows so a brand-new install doesn't show an empty page.
  // Replace them with real students from the admin panel.
  await seedIfEmpty("students", () => prisma.student.count(), () =>
    prisma.student.createMany({
      data: [
        {
          name: "RISHI Lab Scholar",
          program: "PhD",
          topic: "Cryogenic RFIC for quantum systems",
          status: "Current",
          category: "Current",
          sortOrder: 1
        },
        {
          name: "M.Tech Research Student",
          program: "MTech",
          topic: "N-path receiver design",
          status: "Current",
          category: "Current",
          sortOrder: 2
        },
        {
          name: "RISHI Lab Alumnus",
          program: "PhD",
          topic: "Q-band mixer design for 5G front ends",
          status: "Graduated",
          category: "Placed",
          sortOrder: 3
        }
      ]
    })
  );

  await seedIfEmpty("goals", () => prisma.goal.count(), () =>
    prisma.goal.createMany({
      data: [
        {
          title: "Build a nationally visible RFIC research platform",
          category: "Lab",
          description: "Grow RISHI Lab through strong publications, measured silicon, and collaborative research.",
          targetYear: "2027",
          status: "Active",
          sortOrder: 1
        },
        {
          title: "Translate research into deployable circuit IP",
          category: "Innovation",
          description: "Move selected RF front-end designs toward prototypes and industry collaboration.",
          targetYear: "2028",
          status: "Planned",
          sortOrder: 2
        },
        {
          title: "Grow research collaboration with academia and industry",
          category: "Research Collaboration",
          description:
            "Establish joint research programs with national labs, industry partners, and international universities to expand RFIC and quantum RF research.",
          targetYear: "2027",
          status: "Active",
          sortOrder: 3
        }
      ]
    })
  );

  await seedIfEmpty("courses", () => prisma.course.count(), () =>
    prisma.course.createMany({
      data: [
        {
          code: "ECN-554",
          title: "Microwave and Millimeter Wave Circuits",
          term: "Autumn Semester",
          level: "Postgraduate",
          description:
            "Advanced course covering microwave and mm-wave circuit design principles, transmission line theory, S-parameters, matching networks, and active/passive microwave components.",
          topics:
            "Transmission Line Theory\nS-Parameter Analysis\nMicrowave Amplifier Design\nOscillator Design\nMixer and Frequency Converter Design",
          sortOrder: 1
        },
        {
          code: "ECN-333",
          title: "Microwave Engineering",
          term: "Spring Semester",
          level: "Undergraduate",
          description:
            "Fundamental course introducing students to microwave theory and applications, covering waveguides, resonators, microwave networks, and basic microwave components.",
          topics: "Maxwell's Equations for Microwaves\nWaveguide Theory\nMicrowave Network Analysis\nCavity Resonators\nMicrowave Measurements",
          sortOrder: 2
        },
        {
          code: "ECN-556",
          title: "RF System Design and Analysis",
          term: "Spring Semester",
          level: "Postgraduate",
          description:
            "Comprehensive course on RF system design covering receiver and transmitter architectures, link budget analysis, noise figure calculations, and nonlinear system analysis.",
          topics: "Receiver Architectures\nTransmitter Design\nLink Budget Analysis\nNoise and Linearity in RF Systems\nRF System Specifications",
          sortOrder: 3
        }
      ]
    })
  );

  console.log(`[seed] done. Admin account: ${email}`);
}

const realPublications = [
  { year: 2023, type: "Conference", title: "A High Isolation Linear Subharmonic Mixer for Q-Band Application", authors: "Srivastava G, Bhatt D", conference: "2023 International Wireless Communications and Mobile Computing (IWCMC)", pages: "1395-1399" },
  { year: 2023, type: "Conference", title: "Ultra Wideband Low Noise N-path Direct Conversion Receiver for 5G-advanced and 6G Wireless System", authors: "Kumari A, Bhatt D", conference: "2023 IEEE International Symposium on Circuits and Systems (ISCAS)" },
  { year: 2022, type: "Conference", title: "A Wideband Noise Cancelling Mixer in 130-nm BiCMOS Process", authors: "Guruprakashkumar P, Bhatt D", conference: "2022 IEEE Microwaves, Antennas, and Propagation Conference (MAPCON)", pages: "1461-1465" },
  { year: 2022, type: "Conference", title: "A Low-Noise Transconductance Amplifier (LNTA) for Cryogenic Applications using CMOS Technology", authors: "Kamparaju G, Bhatt D", conference: "2022 Austrochip Workshop on Microelectronics (Austrochip)", pages: "61-64" },
  { year: 2022, type: "Journal", title: "Advanced System Analysis and Survey on the GPS Receiver Front End", authors: "Kumari A, Bhatt D", journal: "IEEE Access" },
  { year: 2021, type: "Conference", title: "A 17-32 GHz Wideband High Isolation Linear mm-Wave Mixer For 5G applications", authors: "Srivastava G, Bhatt D", conference: "2020 IEEE MTT-S Latin America Microwave Conference (LAMC 2020)" },
  { year: 2019, type: "Conference", title: "Design of Wideband Active Mixer by using an Active Inductor", authors: "Bhatt D", conference: "2019 IEEE Asia-Pacific Microwave Conference (APMC)", pages: "1173-1175" },
  { year: 2018, type: "Thesis", title: "Study and Design of Integrated Mixer and LNA Topologies for WiFi and Wideband Systems with a High Immunity to Parasitic Signal Feedthrough", authors: "Bhatt DK", conference: "PhD Thesis, Monash University" },
  { year: 2018, type: "Journal", title: "Low-power switched transconductance mixer and LNA design for Wi-Fi and WiMAX applications in 65 nm CMOS", authors: "Bhatt D, Mukherjee J, Redouté JM", journal: "IET Microwaves, Antennas & Propagation", volume: "12", pages: "1736-1744" },
  { year: 2017, type: "Journal", title: "A 1-11 GHz ultra-wideband LNA using M-derived inductive peaking circuit in UMC 65 nm CMOS", authors: "Bhatt D, Mukherjee J, Redouté JM", journal: "Microwave and Optical Technology Letters", volume: "59", pages: "521-526" },
  { year: 2017, type: "Journal", title: "A Self-Biased Mixer in 0.18um CMOS for an Ultra-Wideband Receiver", authors: "Bhatt D, Mukherjee J, Redouté JM", journal: "IEEE Transactions on Microwave Theory and Techniques", volume: "65", pages: "1294-1302" },
  { year: 2017, type: "Journal", title: "Multi Mode Resonators Based Triple Band Notch UWB Filter", authors: "Kamma A, Das R, Bhatt D, Mukherjee J", journal: "IEEE Microwave and Wireless Components Letters", volume: "27", pages: "120-122" },
  { year: 2016, type: "Journal", title: "Low-Power Linear Bulk-Injection Mixer for Wide-Band Applications", authors: "Bhatt D, Mukherjee J, Redouté JM", journal: "IEEE Microwave and Wireless Components Letters", volume: "26", pages: "828-830" },
  { year: 2016, type: "Journal", title: "A high-isolation linear folded mixer for ISM band in UMC 180NM CMOS technology", authors: "Bhatt D, Mukherjee J, Redouté JM", journal: "Microwave and Optical Technology Letters", volume: "58", pages: "2461-2466" },
  { year: 2014, type: "Conference", title: "A high isolation linear folded mixer for WiFi applications", authors: "Bhatt D, Mukherjee J, Redoute JM", conference: "2014 IEEE International Symposium on Circuits and Systems (ISCAS)", pages: "694-697" }
].map((publication, index) => ({ ...publication, sortOrder: index + 1 }));

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
