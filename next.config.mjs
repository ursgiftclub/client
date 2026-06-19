/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
  },

  allowedDevOrigins: ["172.20.10.4", "192.168.1.10", "192.168.29.232"],
};

export default nextConfig;
