import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // @ts-ignore
  allowedDevOrigins: ["*.ngrok-free.app", "*.ngrok.io", "localhost:3000"],
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: '217.76.48.136',
          },
        ],
        permanent: true,
        destination: 'https://captradepro.com/:path*',
      },
      {
         source: '/:path*',
         has: [
           {
             type: 'host',
             value: '217.76.48.136:3000',
           },
         ],
         permanent: true,
         destination: 'https://captradepro.com/:path*',
      }
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.captradepro.com/api/:path*',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(self), microphone=(), geolocation=()', // Enable camera for KYC
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
