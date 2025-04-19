'use client';

import BackToTop from '@/components/back-to-top';
import { Toaster } from '@/components/ui/toaster';
import ToastNotification from '@/components/notification/toast-notification';
import dynamic from 'next/dynamic';
const Navbar = dynamic(() => import('@/components/Header'), { ssr: true });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Navbar />
      <main className="pt-28">{children}</main>
      <Toaster />
      <ToastNotification/>
      <Footer />
      <BackToTop />
    </div>
  );
}

