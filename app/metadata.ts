// app/metadata.ts
import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#22c55e',
};

export const metadata: Metadata = {
  title: {
    default: 'Barkati Nikah Fast Service - Halal Islamic Matrimony',
    template: '%s | Nikah Aasan',
  },
  description: 'Find your halal life partner in Patna, Chhapra & across Bihar. Join 5000+ happy couples who found their perfect match through our privacy-focused, Sharia-compliant matrimony platform.',
  keywords: [
    'Islamic matrimony',
    'Barkati Nikah Fast Service',
    'Barkati Nikah Service',
    'Barkati Nikah Fast',
    'Barkati Nikah',
    'Barkati',
    'halal marriage',
    'Muslim matrimony Bihar',
    'Nikah in Patna',
    'rishta in Chhapra',
    'Muslim marriage',
    'halal rishta',
    'Bihar Muslim matrimony',
    'Sharia compliant marriage',
  ],
  authors: [{ name: 'Nikah Aasan' }],
  creator: 'Nikah Aasan',
  publisher: 'Nikah Aasan',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Nikah Aasan - Halal Islamic Matrimony',
    description: 'Find your perfect halal life partner in Bihar',
    url: 'https://nikahaasan.com',
    siteName: 'Nikah Aasan',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Nikah Aasan - Islamic Matrimony',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nikah Aasan - Halal Islamic Matrimony',
    description: 'Find your perfect halal life partner in Bihar',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://nikahaasan.com',
  },
  category: 'matrimony',
};