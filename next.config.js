/** @type {import('next').NextConfig} */

const nextConfig = {
  // output: 'export', // Removed to allow API routes
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
