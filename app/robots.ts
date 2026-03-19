// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/user/settings'],
    },
    sitemap: 'https://aao-nikah-aashan-kare.com/sitemap.xml',
  };
}