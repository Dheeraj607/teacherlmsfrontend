// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   // ✅ Ignore ESLint errors during build (IMPORTANT)
//   eslint: {
//     ignoreDuringBuilds: true,
//   },

//   // ✅ Allow backend images
//   images: {
//     remotePatterns: [
//       {
//         protocol: "http",
//         hostname: "localhost",
//         port: "3000",
//         pathname: "/**",
//       },
//       {
//         protocol: "http",
//         hostname: "ec2-13-234-30-113.ap-south-1.compute.amazonaws.com",
//         port: "3000",
//         pathname: "/**",
//       },
//     ],
//   },
// };

// export default nextConfig;
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
        hostname: "https://d1ojm6zdv3m37g.cloudfront.net",
        port: "3000",
        pathname: "/**",
      },
    ],
  },
  output: "standalone", // ✅ ensures Amplify builds properly
};

export default nextConfig;
