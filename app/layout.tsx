// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import Footer from '@/components/layout/Footer';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  weight: ['400', '500', '600', '700'],
});

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  preload: false,
  weight: ['600', '700'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#22c55e',
};

export const metadata: Metadata = {
  title: {
  default: 'Nikah Aasan - Maulana Farooq | Halal Islamic Matrimony',
  template: '%s | Nikah Aasan - Maulana Farooq',
},
description: 'Find your halal life partner with Maulana Farooq at Nikah Aasan. India\'s most trusted Islamic matrimony service in Patna, Chhapra & across Bihar. Join 5000+ happy couples who found their perfect match through our privacy-focused, Sharia-compliant matrimony platform under the guidance of Maulana Farooq.',
  keywords: [
  // Core Keywords
  'Islamic matrimony',
  'halal marriage',
  'Muslim matrimony Bihar',
  'Nikah in Patna',
  'rishta in Chhapra',
  
  // 🆕 Brand Keywords with Owner Name
  'Maulana Farooq matrimony',
  'Maulana Farooq Nikah service',
  'Maulana Farooq rishta',
  'Nikah Aasan Maulana Farooq',
  'Maulana Farooq Islamic matchmaking',
  'Mufti Farooq matrimony',
  'Maulana Farooq marriage bureau',
  'Farooq sb rishta service',
  
  // Location Based
  'Muslim marriage Patna',
  'matrimony Chhapra',
  'rishta Muzaffarpur',
  'Nikah Gaya',
  'Bihar Muslim matchmaking',
  'Saran matrimony Maulana Farooq',
  'Patna rishta Maulana Farooq',
  
  // Service Based
  'halal rishta',
  'Sharia compliant marriage',
  'online Muslim matrimony',
  'verified Muslim profiles',
  'family arranged marriage',
  'Nikah registration service',
  'Qazi services Patna',
  
  // User Intent
  'find Muslim life partner',
  'matchmaking service Bihar',
  'marriage bureau Patna',
  'rishta online',
  'serious relationship halal',
  'Maulana Farooq matchmaking',
  'trusted rishta service',
  
  // Long Tail with Owner
  'best matrimony site in Bihar Maulana Farooq',
  'trusted Muslim matchmaking by Maulana Farooq',
  'parents approved rishta Maulana Farooq',
  'Maulana Farooq marriage advice',
  'Islamic marriage guidance Farooq sb',
  'Mufti Farooq Nikah consultation',
  
  // Regional (Hindi/Urdu)
  'मौलाना फारूक मैट्रिमोनी',
  'मौलाना फारूक निकाह सेवा',
  'मौलाना फारूक रिश्ता',
  'मौलाना फारूक शादी',
  'मुफ्ती फारूक मैचमेकिंग',
  'मौलाना फारूक ब्यूरो',
  
  // Professional Titles
  'Mufti Farooq matrimony',
  'Qazi Farooq Nikah service',
  'Maulana Farooq marriage counseling',
  'Islamic scholar matrimony',
  'Maulana Farooq halal matchmaking',
  
  // Trust & Authority
  'Maulana Farooq verified rishta',
  'Maulana Farooq trusted service',
  'Maulana Farooq marriage bureau Bihar',
  'Maulana Farooq Patna',
  'Maulana Farooq Chhapra'
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning={true}
      className={`${inter.variable} ${poppins.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="/api" />
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#22c55e" />
        <meta name="msapplication-TileColor" content="#22c55e" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body 
        className={`${inter.className} antialiased bg-cream-50 dark:bg-dark-400 text-dark-200 dark:text-cream-50`}
        suppressHydrationWarning={true}
      >
        <Providers>
          <a 
            href="#main-content" 
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-green-600 focus:text-white focus:rounded-lg"
          >
            Skip to main content
          </a>
          
          <main id="main-content" className="min-h-screen">
            {children}
          </main>
          
          <Footer />
        </Providers>
      </body>
    </html>
  );
}