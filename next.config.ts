import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Shop logo uploads are capped at 2MB by the API; leave headroom for multipart overhead.
      bodySizeLimit: "3mb",
    },
  },
};

export default nextConfig;
