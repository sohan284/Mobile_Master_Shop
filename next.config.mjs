/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'save-co.lumivancelabs.com',
        port: '',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'save-co.lumivancelabs.com',
        port: '',
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;
