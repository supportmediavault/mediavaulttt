import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site: every page is pre-rendered to plain HTML (best for SEO and
  // free hosting). All media processing happens in the visitor's browser.
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
