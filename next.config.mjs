/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports for hosting without Node.js
  output: process.env.EXPORT_MODE === 'static' ? 'export' : undefined,
  
  // Configure image domains if needed
  images: {
    domains: ['localhost', 'example.com'],
  },
  
  // Add redirects
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true,
      },
    ];
  },
  
  // Add headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

