import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Which build is live, for checking that auto-deploy picked up a push.
// Secrets are reported only as set / not set, never their values.
export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isSet = (name: string) => Boolean(process.env[name]);

  return NextResponse.json({
    commit: process.env.APP_COMMIT || "unknown",
    builtAt: process.env.APP_BUILT_AT || "unknown",
    startedAt: new Date(Date.now() - process.uptime() * 1000).toISOString(),
    runSeedOnBoot: process.env.RUN_SEED_ON_BOOT || "unset",
    adminEmail: process.env.ADMIN_EMAIL || "unset",
    secretsSet: {
      DATABASE_URL: isSet("DATABASE_URL"),
      AUTH_SECRET: isSet("AUTH_SECRET"),
      ADMIN_PASSWORD: isSet("ADMIN_PASSWORD")
    }
  });
}
