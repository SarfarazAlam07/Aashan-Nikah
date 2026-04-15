// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import ClientLayout from './ClientLayout';

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
  metadataBase: new URL('https://barkatinikah.vercel.app'),
  title: {
    default: 'Barkati Fast Nikah Service - Halal Islamic Matrimony',
    template: '%s | Barkati Nikah Service',
    
  },
  description: 'Barkati Fast Nikah Service - India\'s most trusted halal Islamic matrimony platform by Maulana Farooq. Serving Patna, Chhapra & across Bihar. Find your halal life partner.',
  keywords: [
    'Barkati Fast Nikah Service',
    'Barkati Fast Nikah Service Chhapra',
    'Barkat-e-Nikah',
    'Barkate nikah',
    'nikah ke barkat',
    'aasan nikah',
    'Barkati Fast Nikah',
    'Barkati Fast',
    'Muslim Nikah',
    'Barkati Chhapra',
    'Nikah',
    'Aao Nikah ashan kare',
    'Muslim acha ladka',
    'Muslim acha ladki',
    'Muslim acha rista',
    'Best rista in chhapra',
    'Best rista in patna',
    'Nikah Service',
    'Barkati Nikah',
    'halal rista',
    'halal rista chhapra ',
    'rista chhapra ',
    'Barkati',
    'Barkati Nikah Fast Service',
    'Nikah Fast Service',
    'Islamic matrimony',
    'halal marriage',
    'Muslim matrimony Bihar',
    'Nikah in Patna',
    'rishta in Chhapra',
    'Maulana Farooq matrimony',
    'halal rishta',
    'Bihar Muslim matrimony',
    'Sharia compliant marriage',
    'Maulana Farooq',
    'Maulana Farooq Chhapra'
    
  ],
  authors: [{ name: 'Maulana Farooq' }],
  creator: 'Maulana Farooq',
  publisher: 'Barkati Nikah Service',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Barkati Nikah Fast Service - Halal Islamic Matrimony',
    description: 'Find your halal life partner with Maulana Farooq at Barkati Nikah Service.',
    url: 'https://barkatinikah.com',
    siteName: 'Barkati Fast Nikah  Service',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Barkati Fast Nikah Service - Halal Islamic Matrimony',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Barkati Nikah Fast Service - Halal Islamic Matrimony',
    description: 'Find your halal life partner with Maulana Farooq.',
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
  alternates: {
    canonical: '/', 
  },
  category: 'matrimony',
  // 🔥 YAHAN TERA GOOGLE SEARCH CONSOLE KA CODE ADD HO GAYA HAI 🔥
  verification: {
    google: 'N9KyvbLeju2mepJmAC4i_WRUEu9TqpZDPsCbpZzEDcg',
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Barkati Fast Nikah Service",
              "alternateName": "Barkati Nikah Service",
              "url": "https://barkatinikah.vercel.app/"
            })
          }}
        />
      </head>
      <body 
        className={`${inter.className} antialiased bg-cream-50 dark:bg-dark-400 text-dark-200 dark:text-cream-50`}
        suppressHydrationWarning={true}
      >
        <Providers>
          <ClientLayout>
            {children}
          </ClientLayout>
        </Providers>
      </body>
    </html>
  );
}