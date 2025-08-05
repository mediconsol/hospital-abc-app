/** @type {import('next').NextConfig} */
const nextConfig = {
  // 기본 설정만 유지
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig