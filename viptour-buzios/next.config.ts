import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
