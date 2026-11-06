/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_APP_NAME: "Albert Linson Personal Intelligence Platform",
    NEXT_PUBLIC_SITE_URL: "https://albertlinson.com",
  },
};

module.exports = nextConfig;
