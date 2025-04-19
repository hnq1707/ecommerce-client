'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LogOut, ShoppingBag, SquareUser, RotateCcw, Settings } from 'lucide-react';
import type { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useAuth } from '@/lib/redux/features/auth/useAuth';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { User } from '@/lib/type/User';

interface UserProfileMenuProps {
  user?: User | null;
  session: Session | null;
  status: 'authenticated' | 'loading' | 'unauthenticated';
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  closeCart?: () => void;
}

export default function UserProfileMenu({
  user,
  session,
  status,
  isOpen,
  setIsOpen,
  closeCart,
}: UserProfileMenuProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

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

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    }
    return user?.lastName?.charAt(0) || 'U';
  };

  const getFullName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.lastName || 'User';
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <DropdownMenu
              open={isOpen}
              onOpenChange={(open) => {
                if (setIsOpen) setIsOpen(open);
                if (open && closeCart) closeCart();
              }}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full p-0 h-10 w-10 border-2 border-transparent hover:border-primary/20 transition-all duration-200"
                  aria-label="User menu"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={
                        status === 'authenticated'
                          ? user?.imageUrl || '/default-avatar.png'
                          : '/default-avatar.png'
                      }
                      alt="User avatar"
                    />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-1">
                {status === 'authenticated' && session ? (
                  <>
                    <div className="px-4 py-3 flex flex-col">
                      <span className="text-base font-medium">{getFullName()}</span>
                      <span className="text-sm text-muted-foreground truncate">
                        {session.user?.email}
                      </span>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="py-2.5 focus:bg-primary/5">
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 cursor-pointer text-base"
                      >
                        <SquareUser className="h-5 w-5 text-primary/80" />
                        <span>Thông tin cá nhân</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="py-2.5 focus:bg-primary/5">
                      <Link
                        href="/change-password"
                        className="flex items-center gap-3 cursor-pointer text-base"
                      >
                        <RotateCcw className="h-5 w-5 text-primary/80" />
                        <span>Đổi mật khẩu</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="py-2.5 focus:bg-primary/5">
                      <Link
                        href="/orders"
                        className="flex items-center gap-3 cursor-pointer text-base"
                      >
                        <ShoppingBag className="h-5 w-5 text-primary/80" />
                        <span>Danh sách đơn hàng</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      disabled={isLoading}
                      className="text-destructive focus:text-destructive focus:bg-destructive/5 py-2.5 text-base"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-3">
                          <div className="h-5 w-5 rounded-full border-2 border-current border-r-transparent animate-spin" />
                          <span>Đang đăng xuất...</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-3">
                          <LogOut className="h-5 w-5" />
                          <span>Đăng xuất</span>
                        </span>
                      )}
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <div className="px-4 py-3">
                      <span className="text-base font-medium">Chào mừng bạn</span>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="py-2.5 focus:bg-primary/5">
                      <Link
                        href="/login"
                        className="flex items-center gap-3 cursor-pointer text-base"
                      >
                        <LogOut className="h-5 w-5 rotate-180 text-primary/80" />
                        <span>Đăng nhập</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="py-2.5 focus:bg-primary/5">
                      <Link
                        href="/signup"
                        className="flex items-center gap-3 cursor-pointer text-base"
                      >
                        <Settings className="h-5 w-5 text-primary/80" />
                        <span>Đăng ký</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{status === 'authenticated' ? 'Tài khoản của bạn' : 'Đăng nhập'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
