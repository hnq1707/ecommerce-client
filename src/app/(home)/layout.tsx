'use client';

import Navbar from '@/components/Header';
import { SessionProvider } from 'next-auth/react';
import Footer from '@/components/Footer';
import StoreProvider from '@/lib/redux/StoreProvider'; // Kiểm tra lại đường dẫn

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <StoreProvider>
        <Navbar />
        <main className="pt-20">{children}</main>
        <Footer />
      </StoreProvider>
    </SessionProvider>
  );
}
