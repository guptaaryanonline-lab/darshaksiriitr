import { NextResponse } from "next/server";
import { setAdminSession, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const { email, password } = (await request.json()) as { email?: string; password?: string };
  if (!email || !password) {
    return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ message: "Invalid admin credentials." }, { status: 401 });
  }

  setAdminSession(user.email);
  return NextResponse.json({ ok: true });
}
