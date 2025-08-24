/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is now stable in Next.js 14+, no experimental flag needed

  // Static export configuration for GitHub Pages
  output: 'export',

  // Enable trailing slashes for better GitHub Pages compatibility
  trailingSlash: true,

  // Base path for GitHub Pages project repository
  // Remove this line if using a custom domain
  basePath: '/songgram',

  // Skip trailing slash redirects for static export
  skipTrailingSlashRedirect: true,

  // Exclude API routes from static export since they won't work on GitHub Pages
  // This prevents build errors from server-side code
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't include API routes in client bundle
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
