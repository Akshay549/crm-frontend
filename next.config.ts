import type { NextConfig } from "next";

// const backendUrl = "http://localhost:5000";
const backendUrl = "https://crm-backend-blush-one.vercel.app";

const nextConfig: NextConfig = {
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${backendUrl}/:path*` }];
  },
};

export default nextConfig;