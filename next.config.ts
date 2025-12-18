import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "d1ojm6zdv3m37g.cloudfront.net",
        pathname: "/**",
      },
    ],
  },
  output: "standalone",
};

export default nextConfig;
