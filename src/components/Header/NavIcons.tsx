'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { LogOut, ShoppingBag, ShoppingCart, SquareUser } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useCartStore } from '@/lib/redux/features/cart/useCartStore';
import CartModal from '../CartModal';
import { useAuth } from '@/lib/redux/features/auth/useAuth';
import { useUsers } from '@/lib/redux/features/user/useUser';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import NotificationBell from '../notification/notification-bell';

const NavIcons = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useAuth();
  const { data: session, status } = useSession();
  const router = useRouter();
  const { user, fetchUser } = useUsers();
  const { totalQuantity } = useCartStore();
  const cartRef = useRef<HTMLDivElement>(null);

  // Fetch user data when session changes
  useEffect(() => {
    if (session?.user?.id) {
      fetchUser(session.user.id);
    }
  }, [session?.user?.id, fetchUser]);

  // Close cart when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsCartOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCart = () => {
    setIsCartOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      if (session?.user?.accessToken) {
        await logout(session.user.accessToken);
        await signOut({ redirect: false });
        router.refresh();
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render anything during initial loading
  if (status === 'loading') return null;

  return (
    <div className="flex items-center gap-5 xl:gap-7 relative">
      {/* User Profile */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full p-0 h-10 w-10"
              aria-label="User menu"
            >
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={
                    status === 'authenticated'
                      ? user?.imageUrl || '/default-avatar.png'
                      : '/default-avatar.png'
                  }
                  alt="User avatar"
                />
                <AvatarFallback>{user?.lastName?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-1">
            {status === 'authenticated' && session ? (
              <>
                <div className="px-3 py-2 text-base font-medium">{user?.lastName || 'User'}</div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="py-2.5">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 cursor-pointer text-base"
                  >
                    <SquareUser className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="py-2.5">
                  <Link href="/orders" className="flex items-center gap-3 cursor-pointer text-base">
                    <ShoppingBag className="h-5 w-5" />
                    <span>My Orders</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="text-destructive focus:text-destructive py-2.5 text-base"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full border-2 border-current border-r-transparent animate-spin" />
                      Logging out...
                    </span>
                  ) : (
                    <span className="flex items-center gap-3">
                      <LogOut className="h-5 w-5" />
                      Logout
                    </span>
                  )}
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem asChild className="py-2.5">
                <Link href="/login" className="flex items-center gap-3 cursor-pointer text-base">
                  <LogOut className="h-5 w-5 rotate-180" />
                  <span>Login</span>
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <NotificationBell />
      </motion.div>

      {/* Shopping Cart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="relative"
        ref={cartRef}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCart}
          className="relative h-12 w-12"
          aria-label="Shopping cart"
          aria-expanded={isCartOpen}
        >
          <ShoppingCart className="h-6 w-6" />
          {totalQuantity > 0 && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute">
              <Badge
                className="absolute -top-1 -right-1 h-6 w-6 p-0 flex items-center justify-center bg-destructive text-base"
                aria-label={`${totalQuantity} items in cart`}
              >
                {totalQuantity}
              </Badge>
            </motion.div>
          )}
        </Button>

        {isCartOpen && (
          <div className="absolute right-0 z-50 mt-2 animate-in fade-in-50 zoom-in-95 duration-200">
            <CartModal />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default NavIcons;
