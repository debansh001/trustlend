import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { getDashboardPath, normalizeUserRole } from "@/lib/auth/roles";

// ── In-memory rate limiter (resets on server restart) ─────────────────────────
// For production, replace with Redis/Upstash for persistence across instances.
const requestCounts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;   // 1-minute window
const MAX_REQUESTS = 30;     // 30 API requests per IP per minute

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "unknown";
}

export async function proxy(request: NextRequest) {
  // ── Rate limiting on API routes ──────────────────────────────────────────────
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const key = getRateLimitKey(request);
    const now = Date.now();
    const record = requestCounts.get(key);

    if (!record || now > record.resetAt) {
      requestCounts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    } else {
      record.count++;
      if (record.count > MAX_REQUESTS) {
        return NextResponse.json(
          { error: "Too many requests, please slow down." },
          {
            status: 429,
            headers: { "Retry-After": String(Math.ceil((record.resetAt - now) / 1000)) },
          }
        );
      }
    }
  }

  // ── Supabase auth session refresh + route guard ──────────────────────────────
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isDashboardPath = pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  const isAuthEntryPath = pathname === "/auth";

  if (isDashboardPath && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/auth";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthEntryPath && user) {
    const redirectUrl = request.nextUrl.clone();
    const role = normalizeUserRole(user.user_metadata?.account_type);
    redirectUrl.pathname = getDashboardPath(role);
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};