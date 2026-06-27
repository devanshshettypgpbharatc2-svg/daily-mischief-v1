/** @type {import('next').NextConfig} */
const SHOPIFY_DOMAIN = 'a5d5y4-ap.myshopify.com'

const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/s/files/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    minimumCacheTTL: 31536000,
  },

  // Redirect Shopify checkout paths to the myshopify.com domain.
  // Shopify returns checkoutUrl using our custom domain, but checkout
  // must be served by Shopify's servers, not our Next.js app.
  async redirects() {
    return [
      {
        source: '/cart/c/:path*',
        destination: `https://${SHOPIFY_DOMAIN}/cart/c/:path*`,
        permanent: false,
      },
      {
        source: '/checkouts/:path*',
        destination: `https://${SHOPIFY_DOMAIN}/checkouts/:path*`,
        permanent: false,
      },
      {
        source: '/payments/:path*',
        destination: `https://${SHOPIFY_DOMAIN}/payments/:path*`,
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
