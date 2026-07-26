import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ['192.168.175.191'],
  experimental: {
    serverActions: {
      bodySizeLimit: "90mb"
    }
  }
};

export default nextConfig;
