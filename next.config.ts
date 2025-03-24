import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "ibss-images.calacademy.org",
        port: "",
        pathname: "/fileget/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        port: "",
        pathname: "/wikipedia/en/**",
      },
    ],
  },
};

export default nextConfig;
