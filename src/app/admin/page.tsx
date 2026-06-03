import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/auth";
import { AdminLogin } from "@/components/admin-login";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getAdminUser();
  if (user) redirect("/admin/dashboard");
  return <AdminLogin />;
}
