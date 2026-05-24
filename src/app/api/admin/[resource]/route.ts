import { NextResponse } from "next/server";
import { isResourceName, type ResourceName } from "@/lib/admin-resources";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

function parseList(value: unknown) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean).join("\n");
  if (typeof value !== "string") return "";
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)
    .join("\n");
}

function findMany(resource: ResourceName) {
  const orderBy = [{ sortOrder: "asc" as const }, { createdAt: "desc" as const }];
  switch (resource) {
    case "projects":
      return prisma.project.findMany({ orderBy });
    case "research":
      return prisma.research.findMany({ orderBy });
    case "patents":
      return prisma.patent.findMany({ orderBy });
    case "students":
      return prisma.student.findMany({ orderBy });
    case "goals":
      return prisma.goal.findMany({ orderBy });
  }
}

function createItem(resource: ResourceName, data: Record<string, unknown>) {
  const createData = data as any;
  switch (resource) {
    case "projects":
      return prisma.project.create({ data: createData });
    case "research":
      return prisma.research.create({ data: createData });
    case "patents":
      return prisma.patent.create({ data: createData });
    case "students":
      return prisma.student.create({ data: createData });
    case "goals":
      return prisma.goal.create({ data: createData });
  }
}

function normalize(resource: ResourceName, body: Record<string, unknown>) {
  const base = { ...body };
  if ("sortOrder" in base) base.sortOrder = Number(base.sortOrder) || 0;
  if ("year" in base) base.year = Number(base.year) || new Date().getFullYear();
  if ("publications" in base) base.publications = Number(base.publications) || 0;
  if (resource === "projects") base.objectives = parseList(base.objectives);
  if (resource === "research") base.topics = parseList(base.topics);
  return base;
}

export async function GET(_: Request, { params }: { params: { resource: string } }) {
  await requireAdmin();
  if (!isResourceName(params.resource)) {
    return NextResponse.json({ message: "Unknown resource." }, { status: 404 });
  }
  const items = await findMany(params.resource);
  return NextResponse.json(items);
}

export async function POST(request: Request, { params }: { params: { resource: string } }) {
  await requireAdmin();
  if (!isResourceName(params.resource)) {
    return NextResponse.json({ message: "Unknown resource." }, { status: 404 });
  }
  const body = (await request.json()) as Record<string, unknown>;
  const item = await createItem(params.resource, normalize(params.resource, body));
  return NextResponse.json(item, { status: 201 });
}
