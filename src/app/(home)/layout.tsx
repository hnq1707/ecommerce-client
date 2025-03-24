'use client';

import Navbar from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/back-to-top';
import { Toaster } from '@/components/ui/toaster';
import ToastNotification from '@/components/notification/toast-notification';

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
