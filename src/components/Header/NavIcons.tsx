'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Bell, ShoppingCart, User } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { useCartStore } from '@/lib/redux/features/cart/useCartStore';
import CartModal from '../CartModal';

const NavIcons = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  // Đóng profile khi logout
  useEffect(() => {
    if (!session) {
      setIsLoggedOut(true); // ✅ Chỉ đặt `true` khi không có session
      setIsProfileOpen(false);
    } else {
      setIsLoggedOut(false); // ✅ Reset lại khi đăng nhập
    }
  }, [session]);

  const handleProfile = () => {
    if (!session) {
      router.push('/login');
    } else {
      setIsProfileOpen((prev) => !prev);
    }
  };
  useEffect(() => {
    if (window.location.pathname === '/profile') {
      setIsProfileOpen(false);
    }
  }, [router]);
  const handleLogout = async () => {
    setIsLoading(true);

    try {
      await signOut({ redirect: false }); // Logout bằng next-auth
      setIsLoggedOut(true);
      router.refresh();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const { totalQuantity } = useCartStore();

  if (status === 'loading') return null;

  return (
    <div className="flex items-center gap-4 xl:gap-6 relative">
      {status === 'authenticated' && !isLoggedOut ? (
        <div className="relative cursor-pointer" onClick={() => setIsProfileOpen((prev) => !prev)}>
          {session.user?.image ? (
            <Image
            className='rounded-full'
              key={session?.user?.image}
              src={session?.user?.image}
              width={30}
              height={30}
              alt="User"
            />
          ) : (
            <User />
          )}
        </div>
      ) : (
        <div className="relative cursor-pointer" onClick={handleProfile}>
          <User />
        </div>
      )}

      {isProfileOpen && (
        <div className="absolute p-4 rounded-md top-12 left-0 bg-white text-sm shadow-md z-20">
          <Link href="/profile" onClick={() => setIsProfileOpen((prev) => !prev)}>Profile</Link>
          <div className="mt-2 cursor-pointer" onClick={handleLogout}>
            {isLoading ? 'Logging out...' : 'Logout'}
          </div>
        </div>
      )}
      <Bell className="cursor-pointer" />
      <div className="relative cursor-pointer" onClick={() => setIsCartOpen((prev) => !prev)}>
        <ShoppingCart />
        <div className="absolute -top-4 -right-4 w-6 h-6 bg-lama rounded-full text-white text-sm flex items-center justify-center">
          {totalQuantity}
        </div>
      </div>
      {isCartOpen && <CartModal />}
    </div>
  );
};

export default NavIcons;
