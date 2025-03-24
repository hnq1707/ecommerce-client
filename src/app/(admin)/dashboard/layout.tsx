'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  BarChart3,
  Package,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  Menu,
  Layers,
  FileText,
  ShieldCheck,
  Loader2,
  User,
  Search,
  ChevronDown,
  X,
  Home,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
import { AuthProvider } from '@/lib/utils/auth/auth-provider';
import PermissionGuard from '@/components/auth/permission-guard';
import AdminNotificationBell from '@/components/admin-notification/admin-notification-bell';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  permission: string; // Thêm trường permission
}

const navItems: NavItem[] = [
  {
    title: 'Tổng quan',
    href: '/dashboard',
    icon: <BarChart3 className="h-5 w-5" />,
    permission: 'dashboard_access', // Quyền truy cập dashboard
  },
  {
    title: 'Danh mục',
    href: '/dashboard/categories',
    icon: <Layers className="h-5 w-5" />,
    permission: 'categories_view', // Quyền xem danh mục
  },
  {
    title: 'Sản phẩm',
    href: '/dashboard/products',
    icon: <Package className="h-5 w-5" />,
    permission: 'products_view', // Quyền xem sản phẩm
  },
  {
    title: 'Đơn hàng',
    href: '/dashboard/orders',
    icon: <ShoppingBag className="h-5 w-5" />,
    // badge: 5,
    permission: 'orders_view', // Quyền xem đơn hàng
  },
  {
    title: 'Người dùng',
    href: '/dashboard/users',
    icon: <Users className="h-5 w-5" />,
    permission: 'users_view', // Quyền xem người dùng
  },
  {
    title: 'Phân quyền',
    href: '/dashboard/roles',
    icon: <ShieldCheck className="h-5 w-5" />,
    permission: 'roles_view', // Quyền xem vai trò
  },
  {
    title: 'Hóa đơn',
    href: '/dashboard/invoices',
    icon: <FileText className="h-5 w-5" />,
    permission: 'orders_export', // Quyền xuất hóa đơn
  },
  {
    title: 'Cài đặt',
    href: '/dashboard/settings',
    icon: <Settings className="h-5 w-5" />,
    permission: 'dashboard_access', // Quyền truy cập dashboard
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Handle logout
  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/login' });
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!session?.user) return 'U';

    if (session.user.name) {
      const nameParts = session.user.name.split(' ');
      if (nameParts.length > 1) {
        return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(
          0,
        )}`.toUpperCase();
      } else {
        return nameParts[0].charAt(0).toUpperCase();
      }
    } else if (session.user.email) {
      return session.user.email.charAt(0).toUpperCase();
    }

    return 'U';
  };

  // Get display name
  const getDisplayName = () => {
    if (!session?.user) return 'User';

    if (session.user.name) {
      return session.user.name;
    } else if (session.user.email) {
      return session.user.email.split('@')[0];
    }

    return 'User';
  };

  const Sidebar = () => (
    <div
      className={`flex h-screen flex-col bg-background transition-all duration-300 ${
        isCollapsed ? 'items-center' : ''
      }`}
    >
      <div
        className={`flex h-16 shrink-0 items-center border-b px-4 ${
          isCollapsed ? 'justify-center' : ''
        }`}
      >
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <ShoppingBag className="h-6 w-6 text-primary" />
          {!isCollapsed && <span className="text-2xl font-semibold tracking-wide">HNQ </span>}
        </Link>
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto lg:flex"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        )}
      </div>

      <ScrollArea className={`flex-1 ${isCollapsed ? 'px-1 py-4' : 'px-2 py-4'}`}>
        <TooltipProvider delayDuration={0}>
          <nav className="flex flex-col gap-1">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

              const NavButton = (
                <Button
                  key={index}
                  asChild
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={`justify-start relative ${
                    isCollapsed ? 'w-10 h-10 p-0 justify-center' : ''
                  }`}
                >
                  <Link href={item.href}>
                    {item.icon}
                    {!isCollapsed && <span className="ml-2">{item.title}</span>}
                    {item.badge && !isCollapsed && (
                      <Badge variant="destructive" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                    {item.badge && isCollapsed && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </Button>
              );

              // Wrap each nav item with PermissionGuard
              return (
                <PermissionGuard key={index} permission={item.permission}>
                  {isCollapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>{NavButton}</TooltipTrigger>
                      <TooltipContent side="right">{item.title}</TooltipContent>
                    </Tooltip>
                  ) : (
                    NavButton
                  )}
                </PermissionGuard>
              );
            })}
          </nav>
        </TooltipProvider>
      </ScrollArea>

      <div className={`shrink-0 border-t p-4 ${isCollapsed ? 'flex justify-center' : ''}`}>
        {status === 'loading' ? (
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            {!isCollapsed && (
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            )}
          </div>
        ) : (
          <div className={`flex items-center gap-2 ${isCollapsed ? 'flex-col' : ''}`}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full p-0">
                  <Avatar className="h-8 w-8 ring-2 ring-primary/10">
                    <AvatarImage
                      src={session?.user?.image || '/placeholder.svg?height=32&width=32'}
                      alt="Avatar"
                    />
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isCollapsed ? 'center' : 'end'}>
                <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Hồ sơ cá nhân
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Cài đặt
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-medium">{getDisplayName()}</span>
                <span className="text-xs text-muted-foreground">{session?.user?.email}</span>
              </div>
            )}

            {!isCollapsed && (
              <Button variant="ghost" size="icon" className="ml-auto" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <motion.div
          className="flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <ShoppingBag className="h-12 w-12 text-primary mb-2" />
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Đang tải thông tin...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <div className="flex h-screen overflow-hidden bg-muted/20">
        {isMobile ? (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="fixed left-4 top-4 z-40 lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <Sidebar />
            </SheetContent>
          </Sheet>
        ) : (
          <div
            className={`hidden lg:block transition-all duration-300 ${
              isCollapsed ? 'lg:w-16' : 'lg:w-64'
            } border-r bg-background`}
          >
            <Sidebar />
          </div>
        )}
        <div className="flex flex-col flex-1 h-screen overflow-hidden">
          <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b bg-background px-4 lg:px-6">
            {isMobile && (
              <Button
                variant="outline"
                size="icon"
                className="mr-2 lg:hidden"
                onClick={() => setIsOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild className="hidden md:flex">
                <Link href="/" className="gap-2">
                  <Home className="h-4 w-4" />
                  <span>Trang chủ</span>
                </Link>
              </Button>

              <nav className="hidden md:flex items-center gap-1">
                <span className="text-muted-foreground mx-2">/</span>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                {pathname !== '/dashboard' && pathname.startsWith('/dashboard/') && (
                  <>
                    <span className="text-muted-foreground mx-2">/</span>
                    <Button variant="ghost" size="sm" className="capitalize">
                      {pathname.split('/').pop()}
                    </Button>
                  </>
                )}
              </nav>
            </div>

            <div className="ml-auto flex items-center gap-4">
              <form className="hidden md:flex relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Tìm kiếm..."
                  className="w-64 pl-8 bg-background"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>

              <AdminNotificationBell />
              {status === 'authenticated' && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={session?.user?.image || '/placeholder.svg?height=32&width=32'}
                          alt="Avatar"
                        />
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                      </Avatar>
                      <div className="hidden md:flex flex-col items-start">
                        <span className="text-sm font-medium">{getDisplayName()}</span>
                        <span className="text-xs text-muted-foreground">
                          {session?.user?.scope
                            ? session.user.scope
                                .split(' ')
                                .find((s) => s.trim().startsWith('ROLE_'))
                                ?.trim()
                                .replace(/^ROLE_/, '') || 'User'
                            : 'User'}
                        </span>
                      </div>
                      <ChevronDown className="h-4 w-4 hidden md:block" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center gap-2 p-2 md:hidden">
                      <div className="flex flex-col">
                        <span className="font-medium">{getDisplayName()}</span>
                        <span className="text-xs text-muted-foreground">
                          {session?.user?.email}
                        </span>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="md:hidden" />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Hồ sơ cá nhân
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/settings" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Cài đặt
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 lg:p-6"
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
