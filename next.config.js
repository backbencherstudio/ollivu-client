/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['192.168.5.6:5000'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '192.168.5.6',
        port: '5000',
        pathname: '/uploads/**',
      },
    ],
  },
}

module.exports = nextConfig