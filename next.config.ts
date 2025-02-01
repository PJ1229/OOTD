// next.config.js
const withPWA = require('next-pwa');

module.exports = withPWA({
  dest: 'public',          // Directory where service worker and assets will be stored
  register: true,          // Automatically register the service worker
  skipWaiting: true,       // Activate new service worker immediately
  reactStrictMode: true,   // Enable React strict mode
});
