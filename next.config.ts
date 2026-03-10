import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['gsap', 'ogl', 'lucide-react', '@paper-design/shaders-react', 'framer-motion', 'dotted-map'],
  },
};

export default nextConfig;
