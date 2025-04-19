/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'codedev.b-cdn.net',
      },
      {
        protocol: 'https',
        hostname: 'file.hstatic.net',
      },
    ],
  },
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  // Tối ưu memory usage
  onDemandEntries: {
    // Thời gian trang được lưu trong bộ nhớ (ms)
    maxInactiveAge: 15 * 1000,
    // Số lượng trang tối đa được lưu trong bộ nhớ
    pagesBufferLength: 2,
  },

};

module.exports = nextConfig;