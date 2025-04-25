/** @types {import('next').NextConfig} */
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
    // Thêm tối ưu hóa
    optimizeServerReact: true,
    serverMinification: true,
  },
  // Tối ưu memory usage
  onDemandEntries: {
    // Giảm thời gian lưu trang trong bộ nhớ (ms)
    maxInactiveAge: 10 * 1000,
    // Giảm số lượng trang tối đa lưu trong bộ nhớ
    pagesBufferLength: 1,
  },
  // Tắt các tính năng không cần thiết
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
};


module.exports = nextConfig;