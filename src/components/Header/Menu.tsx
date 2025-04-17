'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlignJustify,
  X,
  Home,
  ShoppingBag,
  Tag,
  Info,
  Mail,
  LogOut,
  ShoppingCart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Menu = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle ESC key to close menu
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    // Prevent scrolling when menu is open
    if (open) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [open]);

  const menuItems = [
    { href: '/', label: 'Trang chủ', icon: Home },
    { href: '/list', label: 'Khám phá ', icon: ShoppingBag },
    { href: '/deals', label: 'Khuyến mãi', icon: Tag },
    { href: '/about', label: 'Về chúng tôi', icon: Info },
    { href: '/contact', label: 'Liên hệ', icon: Mail },
    { href: '/logout', label: 'Đăng xuất', icon: LogOut },
    { href: '/cart', label: 'Cart(1)', icon: ShoppingCart },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label="Menu"
        className="h-10 w-10 rounded-full"
      >
        {open ? <X className="h-5 w-5" /> : <AlignJustify className="h-5 w-5" />}
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/95 text-white z-50 flex flex-col items-center justify-center"
            aria-hidden={!open}
            role="dialog"
            aria-modal="true"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="absolute top-5 right-5 text-white hover:bg-white/10 rounded-full"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </Button>

            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex flex-col items-center justify-center gap-6 text-xl"
            >
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 py-2 px-4 rounded-md hover:bg-white/10 transition-colors duration-200"
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </motion.div>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Menu;
