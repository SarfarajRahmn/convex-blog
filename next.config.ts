import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "images.unsplash.com",
        protocol: "https",
        port: "",
      },
      {
        hostname: "doting-hound-343.convex.cloud",
        protocol: "https",
        port: "",
      },
      {
        hostname: "doting-hound-343.convex.site",
        protocol: "https",
        port: "",
      },
    ],
  },
};

export default nextConfig;
