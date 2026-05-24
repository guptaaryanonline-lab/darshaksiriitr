import { prisma } from "@/lib/db";

export async function getSiteContent() {
  const [projects, research, patents, students, goals] = await Promise.all([
    prisma.project.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }),
    prisma.research.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }),
    prisma.patent.findMany({ orderBy: [{ sortOrder: "asc" }, { year: "desc" }] }),
    prisma.student.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }),
    prisma.goal.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] })
  ]);

  return { projects, research, patents, students, goals };
}

export function asStringArray(value: unknown) {
  if (typeof value === "string") {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return Array.isArray(value) ? value.map(String) : [];
}
