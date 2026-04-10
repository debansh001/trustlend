import { redirect } from "next/navigation";
import { getDashboardPath } from "@/lib/auth/roles";
import { requireAuthenticatedUser } from "@/lib/auth/session";

export default async function DashboardEntryPage() {
  const { role } = await requireAuthenticatedUser();
  redirect(getDashboardPath(role));
}
