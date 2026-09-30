import { NextResponse } from "next/server";
import { isResourceName, type ResourceName } from "@/lib/admin-resources";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

function parseList(value: unknown) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean).join("\n");
  if (typeof value !== "string") return "";
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)
    .join("\n");
}

function updateItem(resource: ResourceName, id: string, data: Record<string, unknown>) {
  const updateData = data as any;
  switch (resource) {
    case "hero":
      return prisma.heroSlide.update({ where: { id }, data: updateData });
    case "projects":
      return prisma.project.update({ where: { id }, data: updateData });
    case "research":
      return prisma.research.update({ where: { id }, data: updateData });
    case "publications":
      return prisma.publication.update({ where: { id }, data: updateData });
    case "students":
      return prisma.student.update({ where: { id }, data: updateData });
    case "goals":
      return prisma.goal.update({ where: { id }, data: updateData });
    case "courses":
      return prisma.course.update({ where: { id }, data: updateData });
  }
}

function deleteItem(resource: ResourceName, id: string) {
  switch (resource) {
    case "hero":
      return prisma.heroSlide.delete({ where: { id } });
    case "projects":
      return prisma.project.delete({ where: { id } });
    case "research":
      return prisma.research.delete({ where: { id } });
    case "publications":
      return prisma.publication.delete({ where: { id } });
    case "students":
      return prisma.student.delete({ where: { id } });
    case "goals":
      return prisma.goal.delete({ where: { id } });
    case "courses":
      return prisma.course.delete({ where: { id } });
  }
}

function normalize(resource: ResourceName, body: Record<string, unknown>) {
  const base = { ...body };
  delete base.id;
  delete base.createdAt;
  delete base.updatedAt;
  if ("sortOrder" in base) base.sortOrder = Number(base.sortOrder) || 0;
  if ("year" in base) base.year = Number(base.year) || new Date().getFullYear();
  if ("publications" in base) base.publications = Number(base.publications) || 0;
  if (resource === "projects") base.objectives = parseList(base.objectives);
  if (resource === "research") base.topics = parseList(base.topics);
  if (resource === "courses") base.topics = parseList(base.topics);
  if (resource === "students") {
    base.linkedinLink = normalizeUrl(base.linkedinLink);
    base.scholarLink = normalizeUrl(base.scholarLink);
  }
  return base;
}

// Accepts "linkedin.com/in/x" as well as full URLs; empty becomes null.
function normalizeUrl(value: unknown) {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text) return null;
  return /^https?:\/\//i.test(text) ? text : `https://${text}`;
}

export async function PUT(request: Request, { params }: { params: { resource: string; id: string } }) {
  await requireAdmin();
  if (!isResourceName(params.resource)) {
    return NextResponse.json({ message: "Unknown resource." }, { status: 404 });
  }
  const body = (await request.json()) as Record<string, unknown>;
  const item = await updateItem(params.resource, params.id, normalize(params.resource, body));
  return NextResponse.json(item);
}

export async function DELETE(_: Request, { params }: { params: { resource: string; id: string } }) {
  await requireAdmin();
  if (!isResourceName(params.resource)) {
    return NextResponse.json({ message: "Unknown resource." }, { status: 404 });
  }
  await deleteItem(params.resource, params.id);
  return NextResponse.json({ ok: true });
}
