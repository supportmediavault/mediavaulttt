import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/mediavault',
  assetPrefix: '/mediavault/',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
