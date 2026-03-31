/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com', 'res.cloudinary.com'],
  }
  // 🔥 experimental.serverActions hata diya kyunki Next 15 me iski zaroorat nahi hai
}

export default nextConfig;