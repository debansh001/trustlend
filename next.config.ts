import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent clickjacking — only allow iframes from same origin
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Prevent MIME type sniffing attacks
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Block XSS reflected attacks in legacy browsers
  { key: "X-XSS-Protection", value: "1; mode=block" },
  // Control what referrer info is sent
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Restrict browser features (no camera/mic/geolocation access from this app)
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // Force HTTPS for 1 year (preload-ready)
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
