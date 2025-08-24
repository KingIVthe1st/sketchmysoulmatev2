/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration for Render deployment
  // Remove static export since Render supports server-side rendering
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't include server-only modules in client bundle
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
