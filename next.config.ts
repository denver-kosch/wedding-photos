import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.175.191"],
  experimental: {
    serverActions: {
      bodySizeLimit: "90mb"
    }
  }
};

export default nextConfig;
