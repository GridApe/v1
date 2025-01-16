/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
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
