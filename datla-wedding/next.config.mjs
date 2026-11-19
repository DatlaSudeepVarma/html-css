/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // AVIF encodes and decodes slowly on phones. WebP is smaller than the source JPEGs and paints sooner.
    formats: ["image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [96, 128, 160, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // `next dev` re-encodes every size on the request path (very slow on Windows). The source photos are
    // already well under 150KB, so serve them directly while developing. Production still optimises.
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
