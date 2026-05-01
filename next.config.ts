import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  experimental: {
    optimizePackageImports: [
      "three",
      "gsap",
      "@hugeicons/react",
      "@hugeicons/core-free-icons",
      "lucide-react",
      "framer-motion",
      "motion",
    ],
  },
  allowedDevOrigins: [
    'preview-chat-6d3e1a24-0d83-4e2c-b2e8-7e18bc0074f0.space-z.ai',
    '.space.chatglm.site',
    '.space-z.ai',
  ],
};

export default nextConfig;
