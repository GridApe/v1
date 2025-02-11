/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',  // Add this for Docker support
  images: {
    unoptimized: true
  },
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    config.cache = false 
    return config
  }
};

export default nextConfig;
