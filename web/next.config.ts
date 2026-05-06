import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // serverExternalPackages tells Next.js to skip bundling these for API routes
  // (mongodb uses native bindings that don't bundle well)
  serverExternalPackages: ["mongodb"],
};

export default nextConfig;
