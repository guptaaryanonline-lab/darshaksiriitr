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
  await prisma.patent.deleteMany();
  await prisma.student.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.course.deleteMany();

  await prisma.project.createMany({
    data: [
      {
        title: "Ultra-Wideband N-Path Direct Conversion Receiver",
        status: "Active",
        duration: "2022-Present",
        image: "/images/20230827_142636.jpg",
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
        image: "/images/20240314_133813.jpg",
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
        image: "/images/20240721_174225.jpg",
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

  await prisma.patent.createMany({
    data: [
      {
        title: "Wideband Noise-Cancelling Mixer Architecture",
        inventors: "Darshak Bhatt, RISHI Lab Team",
        status: "Filed",
        year: 2025,
        description: "A mixer topology for improved noise and linearity in wideband receiver front ends.",
        sortOrder: 1
      }
    ]
  });

  await prisma.student.createMany({
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
        program: "M.Tech",
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
      },
      {
        name: "M.Tech Alumnus",
        program: "M.Tech",
        topic: "Low-noise amplifier design for wideband receivers",
        status: "Graduated",
        category: "Placed",
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
