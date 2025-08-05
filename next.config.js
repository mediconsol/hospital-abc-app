/** @type {import('next').NextConfig} */
const nextConfig = {
  // Additional stability improvements
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Optimize React Server Components
  experimental: {
    serverComponentsExternalPackages: [],
  },
}

module.exports = nextConfig