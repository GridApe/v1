/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  experimental: {
    optimizeCss: true,
    turbotrace: {
      memoryLimit: 4096,
    },
  },
  webpack: (config, { isServer }) => {
    config.cache = false 
    
    return config
  }
};

export default nextConfig;
