/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // This reduces unnecessary re-renders
  experimental: {
    reactRoot: false, // Disables Fast Refresh internally
  },
};

export default nextConfig;
