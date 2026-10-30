import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/easyconvert',
  assetPrefix: '/easyconvert/',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
