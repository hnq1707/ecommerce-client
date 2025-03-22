'use client';

import type React from 'react';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/utils/auth/auth-provider';
import { useSession } from 'next-auth/react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredRole?: string;
  fallbackUrl?: string;
}

export default function ProtectedRoute({
  children,
  requiredPermission,
  requiredRole,
  fallbackUrl = '/login',
}: ProtectedRouteProps) {
  const { user, isLoading, hasPermission, hasRole } = useAuth();
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Đợi cho đến khi trạng thái xác thực được xác định
    if (isLoading || status === 'loading') return;

    // Nếu chưa xác thực, chuyển hướng đến trang đăng nhập
    if (status === 'unauthenticated') {
      router.push(`${fallbackUrl}?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    // Nếu đã xác thực nhưng thiếu quyền cần thiết
    if (requiredPermission && !hasPermission(requiredPermission)) {
      router.push('/unauthorized');
      return;
    }

    // Nếu đã xác thực nhưng thiếu vai trò cần thiết
    if (requiredRole && !hasRole(requiredRole)) {
      router.push('/unauthorized');
      return;
    }
  }, [
    isLoading,
    status,
    user,
    requiredPermission,
    requiredRole,
    router,
    pathname,
    fallbackUrl,
    hasPermission,
    hasRole,
  ]);

  // Không hiển thị gì khi đang kiểm tra xác thực
  if (isLoading || status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">Đang tải...</div>;
  }

  // Nếu chưa xác thực hoặc không có quyền, không hiển thị nội dung
  if (
    status === 'unauthenticated' ||
    (requiredPermission && !hasPermission(requiredPermission)) ||
    (requiredRole && !hasRole(requiredRole))
  ) {
    return null;
  }

  // Nếu đã xác thực và có quyền, hiển thị nội dung
  return <>{children}</>;
}
