// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//   optimizeCss: false,
//   experimental: {
//     authInterrupts: true,
//     serverActions: {
//       bodySizeLimit: "10mb",
//     },
//   },

//   // >>> เพิ่มบรรทัดนี้ <<<

//   // eslint: {
//   //   ignoreDuringBuilds: true,
//   // },
//   images: {
//     dangerouslyAllowSVG: true,
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "lh3.googleusercontent.com",
//       },
//       {
//         protocol: "https",
//         hostname: "ik.imagekit.io",
//       },
//       {
//         protocol: "https",
//         hostname: "placehold.co",
//       },
//     ],
//   },
// };

// export default nextConfig;

// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   experimental: {
//     optimizeCss: false, // ปิด lightningcss
//     authInterrupts: true,
//     serverActions: { bodySizeLimit: "10mb" },
//   },

//   images: {
//     dangerouslyAllowSVG: true,
//     remotePatterns: [
//       { protocol: "https", hostname: "lh3.googleusercontent.com" },
//       { protocol: "https", hostname: "ik.imagekit.io" },
//       { protocol: "https", hostname: "placehold.co" },
//     ],
//   },
// };

// export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  experimental: {
    optimizeCss: false, // ปิด lightningcss
    authInterrupts: true,
    serverActions: { bodySizeLimit: "10mb" },
  },

  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
    remotePatterns: [
      // Google Profile Images
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },

      // Facebook
      {
        protocol: "https",
        hostname: "*.fbsbx.com",
      },

      // Line
      {
        protocol: "https",
        hostname: "*.line-scdn.net",
      },

      // ImageKit CDN
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },

      // Placehold.co
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

export default nextConfig;
