import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    ppr: true,
  },
  // images: {
  //   remotePatterns: [
  //     {
  //       hostname: 'img.clerk.com',
  //     },
  //   ],
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*", // Allow images from all domains
      },
    ],
  },
  serverExternalPackages: ["pdf.js-extract", "pdf-parse"],
};

export default nextConfig;
