/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance & Optimization
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  
  // Fix hot reloading on Windows
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    return config
  },
  
  // Image Optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    domains: [
      'localhost',
      'auray-petition.vercel.app',
      'images.unsplash.com',
      'cdn.openai.com', // DALL-E generated images
      'image.cdn.stability.ai', // Stable Diffusion
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Security Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com https://www.google.com https://www.gstatic.com https://www.recaptcha.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://api.openai.com https://api.stability.ai https://sheets.googleapis.com https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://*.google-analytics.com https://ssl.google-analytics.com; frame-src https://www.google.com https://www.recaptcha.net;"
          }
        ],
      },
    ]
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/petition',
        destination: '/',
        permanent: true,
      },
      {
        source: '/signatures',
        destination: '/#signatures',
        permanent: true,
      },
    ]
  },

  // Environment Variables Validation
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME || 'Pétition Numérique - Auray',
  },

  // Bundle Analyzer (optional)
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config) => {
      const { BundleAnalyzerPlugin } = require('@next/bundle-analyzer')()
      config.plugins.push(new BundleAnalyzerPlugin())
      return config
    },
  }),

  // Output for static export if needed
  output: 'standalone',
  
  // Disable x-powered-by header
  poweredByHeader: false,
  
  // Compression
  compress: true,
  
  // React Strict Mode
  reactStrictMode: false,
  
  // SWC Minification
  swcMinify: true,
}

module.exports = nextConfig
