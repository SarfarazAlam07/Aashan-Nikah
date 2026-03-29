// app/ClientLayout.tsx
'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/layout/Footer';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Pages where footer should NOT appear
  const noFooterRoutes = [
    '/admin', 
    '/mufti', 
    '/user', 
    '/signin', 
    '/signup'
  ];
  
  // Check if current path should hide footer
  const shouldHideFooter = noFooterRoutes.some(route => 
    pathname === route || pathname?.startsWith(route + '/')
  );
  
  return (
    <>
      <main id="main-content" className="min-h-screen">
        {children}
      </main>
      {!shouldHideFooter && <Footer />}
    </>
  );
}