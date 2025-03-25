/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'ibss-images.calacademy.org',
      },
      {
        protocol: 'https',
        hostname: 'ibss-images.calacademy.org',
      },
    ],
  },
};

module.exports = nextConfig; 