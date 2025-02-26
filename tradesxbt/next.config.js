/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Enable Edge Runtime for API routes
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    instrumentationHook: true, // Enable instrumentation hook for Redis
    serverComponentsExternalPackages: [
      '@anthropic-ai/sdk',
      '@vercel/kv',
      'nodemailer'
    ],
  },
  
  // Image optimization configuration
  images: {
    domains: ['tradesxbt.com', 'solana.com', 'arweave.net'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vercel-storage.com',
      },
      {
        protocol: 'https', 
        hostname: '**.arweave.net',
      }
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 1 week
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Compression and optimization
  compress: true,
  
  // Custom headers for static assets
  async headers() {
    return [
      {
        source: '/(.*).(.*)$',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Redirects for SEO 
  async redirects() {
    return [
      {
        source: '/trade/:token',
        destination: '/trading?token=:token',
        permanent: true,
      },
    ];
  },
  
  // Rewriting to API endpoints
  async rewrites() {
    return {
      beforeFiles: [
        // These rewrites are checked before pages/public files
        // are checked
        {
          source: '/api/v1/:path*',
          destination: '/api/:path*',
        },
      ],
      afterFiles: [
        // These rewrites are checked after pages/public files
        // are checked but before dynamic routes
        {
          source: '/docs/v1',
          destination: '/docs',
        },
      ],
      fallback: [
        // These rewrites are checked after both pages/public files
        // and dynamic routes are checked
        {
          source: '/:path*',
          destination: `https://tradesxbt-storybook.vercel.app/:path*`,
          has: [
            {
              type: 'query',
              key: 'design-preview',
              value: 'true',
            },
          ],
        },
      ],
    };
  },
  
  // Configure build output
  output: 'standalone',
  
  // Disable etags for API routes
  generateEtags: {
    handlers: false,
    pages: true,
  },
  
  // Other configurations
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;