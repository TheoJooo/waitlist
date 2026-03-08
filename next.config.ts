import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['gsap', 'ogl', 'lucide-react', '@paper-design/shaders-react'],
  },
};

export default nextConfig;
