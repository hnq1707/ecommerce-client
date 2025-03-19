'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
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
import { cn } from '@/lib/utils';

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
    { href: '/', label: 'Homepage', icon: Home },
    { href: '/list', label: 'Shop', icon: ShoppingBag },
    { href: '/deals', label: 'Deals', icon: Tag },
    { href: '/about', label: 'About', icon: Info },
    { href: '/contact', label: 'Contact', icon: Mail },
    { href: '/logout', label: 'Logout', icon: LogOut },
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

      <div
        className={cn(
          'fixed inset-0 bg-black/95 text-white z-50 flex flex-col items-center justify-center transition-all duration-300 ease-in-out',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
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

        <nav className="flex flex-col items-center justify-center gap-6 text-xl">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 py-2 px-4 rounded-md hover:bg-white/10 transition-colors duration-200"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Menu;
