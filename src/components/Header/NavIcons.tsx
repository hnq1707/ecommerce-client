'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Bell, LogOut, ShoppingCart, SquareUser, User } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { useCartStore } from '@/lib/redux/features/cart/useCartStore';
import CartModal from '../CartModal';
import { useAuth } from '@/lib/redux/features/auth/useAuth';
import { useUsers } from '@/lib/redux/features/user/useUser';

const NavIcons = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { logout } = useAuth();
  const { data: session, status } = useSession();
  const router = useRouter();
  const { user, fetchUser } = useUsers();

  useEffect(() => {
    if (session?.user?.id) {
      fetchUser(session.user.id);
    }
  }, [session?.user?.id]);
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
      if (session) {
        if (session?.user?.accessToken) {
          await logout(session.user.accessToken);
        }
      }
      await signOut({ redirect: false });
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
          {session.user ? (
            <Image
              className="rounded-full"
              key={user?.imageUrl}
              src={user?.imageUrl || '/default-avatar.png'}
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
        <div className="absolute p-4 rounded-lg top-12 left-0 bg-white text-sm shadow-lg z-20 w-40 transition-all duration-200 animate-fade-in">
          <Link
            href="/profile"
            className="flex items-center gap-2  py-2 px-3 rounded-md hover:bg-gray-100 transition-all duration-200"
            onClick={() => setIsProfileOpen(false)}
          >
            <SquareUser/>
            Profile
          </Link>
          <div
            className="mt-2 flex items-center gap-2 py-2 px-3 rounded-md cursor-pointer hover:bg-gray-100 transition-all duration-200"
            onClick={handleLogout}
          >
            {isLoading ? (
              <span className="text-gray-500 animate-pulse">Logging out...</span>
            ) : (
              <>
                <LogOut size={16} className="text-gray-600" />
                <span>Logout</span>
              </>
            )}
          </div>
        </div>
      )}
      <Bell className="cursor-pointer" />
      {/* Shopping Cart */}
      <div
        className="relative cursor-pointer hover:opacity-80 transition-all duration-200"
        onClick={() => setIsCartOpen((prev) => !prev)}
      >
        <ShoppingCart
          className="text-gray-600 hover:text-gray-800 transition-all duration-200"
          size={28}
        />
        {totalQuantity > 0 && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold shadow-md">
            {totalQuantity}
          </div>
        )}
      </div>
      {isCartOpen && <CartModal />}
    </div>
  );
};

export default NavIcons;
