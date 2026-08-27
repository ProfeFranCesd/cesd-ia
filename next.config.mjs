/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://classroom.google.com https://*.google.com;",
          },
        ],
      },
    ]
  },
}

export default nextConfig