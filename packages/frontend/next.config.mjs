/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  ignoreDuringBuilds: false,
  eslint: {
    dirs: ["src"],
  },
}

export default nextConfig
