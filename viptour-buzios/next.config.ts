import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    const headers = [
      { key: "Cache-Control", value: "private, no-store, max-age=0" },
      { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
      { key: "Referrer-Policy", value: "no-referrer" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      {
        key: "Content-Security-Policy",
        value:
          "frame-ancestors 'none'; base-uri 'self'; form-action 'self' https://accounts.google.com",
      },
    ];
    return [
      { source: "/brandexperience/crm-nz/:path*", headers },
      { source: "/api/crm-nz/:path*", headers },
    ];
  },
  async redirects() {
    return [
      {
        source: "/projects/viptour",
        destination: "/projects/buzios-buggy",
        permanent: true,
      },
      {
        source: "/projects/viptour/:path*",
        destination: "/projects/buzios-buggy/:path*",
        permanent: true,
      },
    ];
  },
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
