import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow local network IP testing in dev
  allowedDevOrigins: ["localhost", "127.0.0.1", "10.5.12.51"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "commons.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "pbnjbekmsjgjvfhmydwc.supabase.co",
      },
    ],
  },
};

export default nextConfig;
