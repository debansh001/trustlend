import { redirect } from "next/navigation";
import {
  getDashboardPath,
  normalizeUserRole,
  type UserRole,
} from "@/lib/auth/roles";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export async function requireAuthenticatedUser(expectedRole?: UserRole) {
  const supabase = await getServerSupabaseClient();

  if (!supabase) {
    redirect("/auth");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  const role = normalizeUserRole(user.user_metadata?.account_type);

  if (expectedRole && role !== expectedRole) {
    redirect(getDashboardPath(role));
  }

  return { user, role };
}