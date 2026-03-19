// app/sitemap.ts
import { MetadataRoute } from 'next';
import connectDB from '@/lib/db/connect';
import User from '@/models/User';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://aao-nikah-aashan-kare.com';
  
  await connectDB();
  
  // Get all verified users for profile pages
  const users = await User.find({ isVerified: true }).select('_id updatedAt');
  
  // Static routes
  const routes = [
    '',
    '/signin',
    '/about',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic profile pages (without sensitive info)
  const profileRoutes = users.map((user) => ({
    url: `${baseUrl}/profile/${user._id}`,
    lastModified: user.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Location-specific pages for SEO
  const locations = [
    'chhapra-saran',
    'patna',
    'phulwari-sharif',
    'sabzibagh',
    'danapur',
    'siwan',
    'gopalganj',
    'muzaffarpur',
  ];

  const locationRoutes = locations.map((location) => ({
    url: `${baseUrl}/matrimony/${location}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...routes, ...profileRoutes, ...locationRoutes];
}