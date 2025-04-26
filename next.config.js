/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['192.168.4.42', '192.168.5.6'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '192.168.4.42',
        port: '5000',
        pathname: '/uploads/',
      },
      {
        protocol: 'http',
        hostname: '192.168.5.6',
        port: '5000',
        pathname: '/uploads/',
      },
    ],
  },
}

module.exports = nextConfig