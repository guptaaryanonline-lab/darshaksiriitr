import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

type SearchParams = Record<string, string | string[] | undefined>;

function getParam(params: SearchParams, key: string) {
  const value = params[key];
  if (!value) return "";
  return Array.isArray(value) ? value[0] : value;
}

function getIntParam(params: SearchParams, key: string, fallback: number) {
  const value = getParam(params, key);
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

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

export async function getProjectPage(searchParams: SearchParams) {
  const page = getIntParam(searchParams, "page", 1);
  const perPage = getIntParam(searchParams, "perPage", 6);
  const status = getParam(searchParams, "status");
  const query = getParam(searchParams, "query");
  const sort = getParam(searchParams, "sort") || "recent";

  const where: any = {};
  if (status) {
    where.status = { equals: status };
  }
  if (query) {
    where.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
      { objectives: { contains: query, mode: "insensitive" } }
    ];
  }

  const orderBy: Prisma.ProjectOrderByWithRelationInput[] =
    sort === "title"
      ? [{ title: "asc" }, { createdAt: "desc" }]
      : sort === "status"
      ? [{ status: "asc" }, { createdAt: "desc" }]
      : sort === "publications"
      ? [{ publications: "desc" }, { createdAt: "desc" }]
      : [{ createdAt: "desc" }];

  const total = await prisma.project.count({ where });
  const statusOptions = await prisma.project.findMany({
    distinct: ["status"],
    select: { status: true },
    orderBy: [{ status: "asc" }]
  });

  const projects = await prisma.project.findMany({
    where,
    orderBy,
    skip: (page - 1) * perPage,
    take: perPage
  });

  return {
    projects,
    total,
    page,
    perPage,
    totalPages: Math.max(1, Math.ceil(total / perPage)),
    status,
    query,
    sort,
    statusOptions: statusOptions.map((item) => item.status)
  };
}

export async function getResearchPage(searchParams: SearchParams) {
  const page = getIntParam(searchParams, "page", 1);
  const perPage = getIntParam(searchParams, "perPage", 6);
  const query = getParam(searchParams, "query");
  const sort = getParam(searchParams, "sort") || "recent";

  const where: any = {};
  if (query) {
    where.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
      { topics: { contains: query, mode: "insensitive" } }
    ];
  }

  const orderBy: Prisma.ResearchOrderByWithRelationInput[] =
    sort === "title" ? [{ title: "asc" }] : [{ createdAt: "desc" }];
  const total = await prisma.research.count({ where });
  const research = await prisma.research.findMany({
    where,
    orderBy,
    skip: (page - 1) * perPage,
    take: perPage
  });

  return {
    research,
    total,
    page,
    perPage,
    totalPages: Math.max(1, Math.ceil(total / perPage)),
    query,
    sort
  };
}

export async function getPatentPage(searchParams: SearchParams) {
  const page = getIntParam(searchParams, "page", 1);
  const perPage = getIntParam(searchParams, "perPage", 6);
  const query = getParam(searchParams, "query");
  const sort = getParam(searchParams, "sort") || "year";

  const where: any = {};
  if (query) {
    where.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { inventors: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } }
    ];
  }

  const orderBy: Prisma.PatentOrderByWithRelationInput[] =
    sort === "status" ? [{ status: "asc" }, { year: "desc" }] : [{ year: "desc" }];
  const total = await prisma.patent.count({ where });
  const patents = await prisma.patent.findMany({
    where,
    orderBy,
    skip: (page - 1) * perPage,
    take: perPage
  });

  return {
    patents,
    total,
    page,
    perPage,
    totalPages: Math.max(1, Math.ceil(total / perPage)),
    query,
    sort
  };
}

export async function getStudentPage(searchParams: SearchParams) {
  const page = getIntParam(searchParams, "page", 1);
  const perPage = getIntParam(searchParams, "perPage", 6);
  const query = getParam(searchParams, "query");
  const sort = getParam(searchParams, "sort") || "name";

  const where: any = {};
  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { program: { contains: query, mode: "insensitive" } },
      { topic: { contains: query, mode: "insensitive" } },
      { status: { contains: query, mode: "insensitive" } }
    ];
  }

  const orderBy: Prisma.StudentOrderByWithRelationInput[] =
    sort === "program" ? [{ program: "asc" }, { name: "asc" }] : [{ name: "asc" }];
  const total = await prisma.student.count({ where });
  const students = await prisma.student.findMany({
    where,
    orderBy,
    skip: (page - 1) * perPage,
    take: perPage
  });

  return {
    students,
    total,
    page,
    perPage,
    totalPages: Math.max(1, Math.ceil(total / perPage)),
    query,
    sort
  };
}

export async function getGoalPage(searchParams: SearchParams) {
  const page = getIntParam(searchParams, "page", 1);
  const perPage = getIntParam(searchParams, "perPage", 6);
  const query = getParam(searchParams, "query");
  const sort = getParam(searchParams, "sort") || "recent";

  const where: any = {};
  if (query) {
    where.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { category: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
      { status: { contains: query, mode: "insensitive" } }
    ];
  }

  const orderBy: Prisma.GoalOrderByWithRelationInput[] =
    sort === "category" ? [{ category: "asc" }] : [{ createdAt: "desc" }];
  const total = await prisma.goal.count({ where });
  const goals = await prisma.goal.findMany({
    where,
    orderBy,
    skip: (page - 1) * perPage,
    take: perPage
  });

  return {
    goals,
    total,
    page,
    perPage,
    totalPages: Math.max(1, Math.ceil(total / perPage)),
    query,
    sort
  };
}

export async function getPublicationPage(searchParams: SearchParams) {
  const year = getParam(searchParams, "year");
  const type = getParam(searchParams, "type");
  const query = getParam(searchParams, "query");

  const where: any = {};
  if (year) {
    where.year = Number(year);
  }
  if (type && type !== "All") {
    where.type = type;
  }
  if (query) {
    where.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { authors: { contains: query, mode: "insensitive" } },
      { journal: { contains: query, mode: "insensitive" } },
      { conference: { contains: query, mode: "insensitive" } }
    ];
  }

  const publications = await prisma.publication.findMany({
    where,
    orderBy: [{ year: "desc" }, { createdAt: "desc" }]
  });

  const yearOptions = await prisma.publication.findMany({
    distinct: ["year"],
    select: { year: true },
    orderBy: { year: "desc" }
  });

  const typeOptions = await prisma.publication.findMany({
    distinct: ["type"],
    select: { type: true },
    orderBy: { type: "asc" }
  });

  const groupedByYear = publications.reduce((acc: any, pub) => {
    if (!acc[pub.year]) acc[pub.year] = [];
    acc[pub.year].push(pub);
    return acc;
  }, {});

  const sortedYears = Object.keys(groupedByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return {
    publications,
    groupedByYear,
    sortedYears,
    year,
    type,
    query,
    yearOptions: yearOptions.map((y) => y.year).sort((a, b) => b - a),
    typeOptions: typeOptions.map((t) => t.type)
  };
}
