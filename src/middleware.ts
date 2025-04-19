/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './auth';

export async function middleware(req: NextRequest) {
  const session = await auth();
  const isAuth = !!session?.user;

  const isAuthPage: boolean =
    req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register');
  const isDashboardPage: boolean = req.nextUrl.pathname.startsWith('/dashboard');
  // Giải mã accessToken để lấy trường scope
  const user = session?.user;
  let scope: string = '';
  if (user?.accessToken) {
    const tokenParts = user.accessToken.split('.');
    if (tokenParts.length >= 2) {
      try {
        // Sử dụng atob để giải mã payload của JWT
        const payload = JSON.parse(atob(tokenParts[1]));
        scope = payload.scope || '';
      } catch (err) {
        scope = '';
      }
    }
  }
  // Xác định quyền truy cập dashboard dựa trên scope
  // Ví dụ: chỉ cho phép nếu scope chứa 'admin' hoặc 'manager'
  const canAccessDashboard: boolean = scope.includes('ADMIN') || scope.includes('MANAGER');

  // Nếu user đã xác thực và đang cố truy cập các trang auth (login, register)
  if (isAuth && isAuthPage) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Nếu user chưa xác thực và cố truy cập trang bảo vệ
  if (!isAuth && !isAuthPage) {
    let from: string = req.nextUrl.pathname;
    if (req.nextUrl.search) {
      from += req.nextUrl.search;
    }
    return NextResponse.redirect(new URL(`/login?from=${encodeURIComponent(from)}`, req.url));
  }

  // Nếu user cố truy cập dashboard nhưng không có scope phù hợp
  if (isDashboardPage && !canAccessDashboard) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register',
    '/profile',
    '/orders/:path*',
    '/checkout/:path*',
    '/checkout',
  ],
};
