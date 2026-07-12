import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Brotli/gzip on every HTML and JS response. Off by default behind some hosts.
  compress: true,
  // Removes the `X-Powered-By: Next.js` header. Free byte, and it stops advertising the
  // exact framework version to anyone scanning for known CVEs.
  poweredByHeader: false,

  images: {
    // AVIF first, WebP second, original last. AVIF is typically 30-50% smaller than WebP
    // at the same perceptual quality; the browser picks the first format it supports.
    formats: ["image/avif", "image/webp"],
    // Long cache on optimised output — the URL is content-addressed, so it is safe.
    minimumCacheTTL: 31_536_000,
  },

  async headers() {
    return [
      {
        // Everything under /brand and /lottie is immutable content: if it changes, it
        // changes filename. A year-long immutable cache means a repeat visitor downloads
        // exactly none of it.
        source: "/:dir(brand|lottie)/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
