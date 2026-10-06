/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    if (process.env.NODE_ENV !== 'development') return [];
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api').replace(/\/$/, '');
    return [{ source: '/backend-api/:path*', destination: `${apiUrl}/:path*` }];
  },
  images: {
    qualities: [75, 92],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'v0.blob.com',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'jeetix-file-service.onrender.com',
      },
      {
        protocol: 'https',
        hostname: 'file-service-1t33.onrender.com',
      },

      {
        protocol: "https",
        hostname: "dgqkosobeyvqhgkpylki.supabase.co"
      },

      {
        protocol: "https",
        hostname: "eonnzdktmvtutiuodhsz.supabase.co",
      },
      {
        protocol: 'https',
        hostname: 'media.licdn.com',
      },
    ],
  },
};

module.exports = nextConfig;
