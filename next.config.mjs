/** @type {import('next').NextConfig} */
const nextConfig = {
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
