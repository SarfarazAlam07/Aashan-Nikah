// next.config.ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com', 'res.cloudinary.com'], // Cloudinary add kiya
  },
  experimental: {
    serverActions: true,
  },
}

export default nextConfig