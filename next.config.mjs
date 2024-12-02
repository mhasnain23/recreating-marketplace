/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["mongoose"],
  },
  images: {
    domains: [
      "res.cloudinary.com",
      "shandarmobile.com",
      "www.apple.com",
      "www.paklap.pk",
      "flowbite.com",
      "encrypted-tbn0.gstatic.com",
      "xcessorieshub.com",
      "cdn.suitdirect.co.uk",
      "appleshop.com.pk",
      "images.pexels.com",
      "files.refurbed.com",
    ],
  },
};

export default nextConfig;
