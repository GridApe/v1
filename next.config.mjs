/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    config.cache = false 
    
    return config
  }
};

export default nextConfig;
