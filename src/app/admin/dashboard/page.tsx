import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/auth";
import { getSiteContent } from "@/lib/content";
import { AdminDashboard } from "@/components/admin-dashboard";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const user = await getAdminUser();
  if (!user) redirect("/admin");
  const content = await getSiteContent();
  return <AdminDashboard email={user.email} initialData={content} />;
}
