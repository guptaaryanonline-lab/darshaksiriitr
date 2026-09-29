import { PrismaClient } from "@prisma/client";
import { createHash, randomBytes, scryptSync } from "crypto";

const prisma = new PrismaClient();

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD || "admin12345";

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash: hashPassword(password)
    }
  });

  await prisma.project.deleteMany();
  await prisma.research.deleteMany();
  await prisma.publication.deleteMany();
  await prisma.student.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.course.deleteMany();

  await prisma.project.createMany({
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
  });

  await prisma.research.createMany({
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
  });

  await prisma.publication.createMany({
    data: [
      {
        title: "An Ultra-Wideband N-Path Direct Conversion Receiver for 5G-Advanced Applications",
        authors: "D. Bhatt, et al.",
        type: "Conference",
        year: 2023,
        conference: "IEEE International Symposium on Circuits and Systems (ISCAS)",
        volume: "",
        pages: "1245-1249",
        doi: "10.1109/ISCAS46773.2023.10181234",
        sortOrder: 1
      },
      {
        title: "High-Isolation Linear Subharmonic Mixer for Q-Band 5G Front Ends",
        authors: "D. Bhatt, et al.",
        type: "Conference",
        year: 2023,
        conference: "IEEE International Wireless Communications and Mobile Computing Conference (IWCMC)",
        volume: "",
        pages: "412-416",
        doi: "10.1109/IWCMC58020.2023.10182345",
        sortOrder: 2
      },
      {
        title: "A Fundamental mm-Wave Mixer for Wideband Communication Systems",
        authors: "D. Bhatt, et al.",
        type: "Conference",
        year: 2020,
        conference: "Latin America Microwave Conference (LAMC)",
        volume: "",
        pages: "1-4",
        doi: "10.1109/LAMC50424.2020.9339432",
        sortOrder: 3
      },
      {
        title: "Cryo-CMOS Low-Noise Transconductance Amplifier for Quantum Computing Readout",
        authors: "D. Bhatt, et al.",
        type: "Conference",
        year: 2022,
        conference: "Austrochip Workshop on Microelectronics",
        volume: "",
        pages: "23-27",
        doi: "10.1109/Austrochip56888.2022.9912345",
        sortOrder: 4
      },
      {
        title: "Reconfigurable Multi-Band N-Path Filters for Software-Defined Receivers",
        authors: "D. Bhatt, et al.",
        type: "Journal",
        year: 2024,
        journal: "IEEE Transactions on Circuits and Systems II: Express Briefs",
        volume: "71",
        pages: "2201-2205",
        doi: "10.1109/TCSII.2024.3378901",
        sortOrder: 5
      }
    ]
  });

  await prisma.student.createMany({
    data: [
      {
        name: "RISHI Lab Scholar",
        program: "PhD",
        topic: "Cryogenic RFIC for quantum systems",
        researchStatement:
          "Designing ultra-low-noise CMOS amplifiers and RF front ends that operate reliably at 4K for scalable quantum computing readout chains.",
        status: "Current",
        category: "Current",
        joiningYear: "2023",
        scholarLink: "https://scholar.google.com",
        linkedinLink: "https://linkedin.com",
        sortOrder: 1
      },
      {
        name: "M.Tech Research Student",
        program: "MTech",
        topic: "N-path receiver design",
        researchStatement: "Exploring wideband N-path filter architectures to improve blocker rejection in software-defined receivers.",
        status: "Current",
        category: "Current",
        joiningYear: "2024",
        sortOrder: 2
      },
      {
        name: "RISHI Lab Alumnus",
        program: "PhD",
        topic: "Q-band mixer design for 5G front ends",
        researchStatement: "Developed high-isolation subharmonic mixers for Q-band and mm-wave 5G communication systems.",
        status: "Graduated",
        category: "Placed",
        joiningYear: "2019",
        scholarLink: "https://scholar.google.com",
        linkedinLink: "https://linkedin.com",
        workplace: "RFIC Design Engineer, Qualcomm",
        sortOrder: 3
      },
      {
        name: "M.Tech Alumnus",
        program: "MTech",
        topic: "Low-noise amplifier design for wideband receivers",
        researchStatement: "Worked on low-noise amplifier topologies optimized for wideband receiver front ends.",
        status: "Graduated",
        category: "Placed",
        joiningYear: "2021",
        linkedinLink: "https://linkedin.com",
        workplace: "Analog Design Engineer, Texas Instruments",
        sortOrder: 4
      }
    ]
  });

  await prisma.goal.createMany({
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
        description: "Move selected RF front-end designs toward patents, prototypes, and industry collaboration.",
        targetYear: "2028",
        status: "Planned",
        sortOrder: 2
      },
      {
        title: "Grow research collaboration with academia and industry",
        category: "Research Collaboration",
        description: "Establish joint research programs with national labs, industry partners, and international universities to expand RFIC and quantum RF research.",
        targetYear: "2027",
        status: "Active",
        sortOrder: 3
      }
    ]
  });

  await prisma.course.createMany({
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
  });

  console.log(`Seeded database. Admin login: ${email} / ${password}`);
  console.log(`Seed marker: ${createHash("sha1").update(email).digest("hex").slice(0, 8)}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
