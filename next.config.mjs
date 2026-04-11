/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // Turbopack reads path aliases from jsconfig.json automatically.
  // Empty turbopack config silences the "no turbopack config" warning.
  turbopack: {},
};

export default nextConfig;
