/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'save-co-e6wj.vercel.app',
        port: '',
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;
