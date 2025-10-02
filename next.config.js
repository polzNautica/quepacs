import withPWA from 'next-pwa';

const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  workboxOptions: {
    // Skip waiting for problematic files
    skipWaiting: true,
    // Don't precache these file patterns
    exclude: [
      /.*dynamic-css-manifest.*/,
      /.*middleware-manifest.*/,
      /.*build-manifest.*/,
      /.*react-loadable-manifest.*/
    ],
  },
});

const nextConfig = {
  reactStrictMode: true,
};

export default pwaConfig(nextConfig);