import { cookies } from "next/headers";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { prisma } from "@/lib/db";

const COOKIE_NAME = "admin_session";

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, passwordHash: string) {
  const [salt, stored] = passwordHash.split(":");
  if (!salt || !stored) return false;
  const hash = scryptSync(password, salt, 64);
  const storedBuffer = Buffer.from(stored, "hex");
  return storedBuffer.length === hash.length && timingSafeEqual(storedBuffer, hash);
}

function sign(value: string) {
  const secret = process.env.AUTH_SECRET || "development-secret";
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function createSessionValue(email: string) {
  const payload = Buffer.from(JSON.stringify({ email, createdAt: Date.now() })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function setAdminSession(email: string) {
  cookies().set(COOKIE_NAME, createSessionValue(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });
}

export function clearAdminSession() {
  cookies().delete(COOKIE_NAME);
}

export async function getAdminUser() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature || sign(payload) !== signature) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      email?: string;
      createdAt?: number;
    };
    if (!data.email || !data.createdAt || Date.now() - data.createdAt > 60 * 60 * 8 * 1000) return null;
    return prisma.user.findUnique({ where: { email: data.email } });
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}
