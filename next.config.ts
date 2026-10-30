import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/mediavault",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
