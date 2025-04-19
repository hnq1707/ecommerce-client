'use client';

import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRef, useState, useEffect } from 'react';
import { useCartStore } from '@/lib/redux/features/cart/useCartStore';
import { useUsers } from '@/lib/redux/features/user/useUser';

import UserProfileMenu from './UserProfile';
import NotificationBell from '../notification/notification-bell';
import ShoppingCartButton from './CartItem';
import CartModal from '../CartModal';

/**
 * NavIcons - Component hiển thị các icon điều hướng chính trong thanh navigation
 * Bao gồm: User profile, thông báo và giỏ hàng
 */
export default function NavIcons() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { data: session, status } = useSession();
  const { user, fetchUser } = useUsers();
  const { totalQuantity } = useCartStore();
  const cartRef = useRef<HTMLDivElement>(null);

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.2 + i * 0.1,
        duration: 0.3,
        ease: 'easeOut',
      },
    }),
  };

  // Fetch user data when session changes
  useEffect(() => {
    if (session?.user?.id) {
      fetchUser(session.user.id);
    }
  }, [session?.user?.id, fetchUser]);

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
  
  const toggleCart = () => setIsCartOpen((prev) => !prev);
  const closeCart = () => setIsCartOpen(false);
  // Don't render anything during initial loading
  if (status === 'loading') return null;

  return (
    <div className="flex items-center gap-5 xl:gap-7 relative">
      {/* User Profile */}
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
      >
        <UserProfileMenu user={user} session={session} status={status} />
      </motion.div>

      {/* Notifications */}
      <motion.div
        custom={1}
        initial="hidden"
        animate="visible"
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
      >
        <NotificationBell />
      </motion.div>

      {/* Shopping Cart */}
      <motion.div
        custom={2}
        initial="hidden"
        animate="visible"
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
        className="relative"
        ref={cartRef}
      >
        <ShoppingCartButton
          isOpen={isCartOpen}
          totalQuantity={totalQuantity}
          onClick={toggleCart}
        />

        {isCartOpen && (
          <div className="absolute right-0 z-50 mt-2 animate-in fade-in-50 zoom-in-95 duration-200 shadow-lg rounded-lg">
            <CartModal onClose={closeCart} />
          </div>
        )}
      </motion.div>
    </div>
  );
}
