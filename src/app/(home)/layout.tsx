'use client';

import Navbar from '@/components/Header';
import Footer from '@/components/Footer';
import StoreProvider from '@/lib/redux/StoreProvider'; // Kiểm tra lại đường dẫn

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

      <StoreProvider>
        <Navbar />
        <main className="pt-28">{children}</main>
        <Footer />
      </StoreProvider>
  
  );
}
