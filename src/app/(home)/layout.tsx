'use client';

import Navbar from '@/components/Header';
import Footer from '@/components/Footer';

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

      
        <div>
          <Navbar />
          <main className="pt-28">{children}</main>
          <Footer />
        </div>
 
  
  );
}
