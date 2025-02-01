import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  /* config options here */
};

const pwaConfig = withPWA({
  dest: "public", // Directory where service worker and assets will be stored
  register: true, // Automatically register the service worker
  skipWaiting: true, // Activate new service worker immediately
});

const finalConfig: NextConfig = {
  ...nextConfig,
  ...pwaConfig,
  reactStrictMode: true,
};

export default finalConfig;
