import type { NextConfig } from "next";

const repo = "mobile-twitter";

const nextConfig: NextConfig = {
  output: "export",
  basePath: `/${repo}`,
  images: { unoptimized: true },
};

export default nextConfig;
