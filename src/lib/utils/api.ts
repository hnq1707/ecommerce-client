/* eslint-disable @typescript-eslint/no-require-imports */
import { auth } from '@/auth';
import { toast } from '@/hooks/use-toast';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { getSession } from 'next-auth/react'; // Client-side

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  let session;

  if (typeof window !== 'undefined') {
    // Client-side: Sử dụng getSession từ next-auth/react
    session = await getSession();
  } else {
    // Server-side: Sử dụng getServerSession từ next-auth
    session = await auth();
  }

  if (session?.user) {
    config.headers.Authorization = `Bearer ${session.user.accessToken}`;
  }

  return config;
});
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Xử lý các lỗi HTTP phổ biến
    const status = error.response?.status;

    if (status === 403) {
      toast({
        title: 'Không có quyền truy cập',
        description: 'Bạn không có quyền thực hiện hành động này',
        variant: 'destructive',
      });
    } else if (status === 500) {
      toast({
        title: 'Lỗi hệ thống',
        description: 'Đã xảy ra lỗi từ phía máy chủ. Vui lòng thử lại sau',
        variant: 'destructive',
      });
    } else {
      // Xử lý các lỗi khác
      const errorMessage = error.response?.data || 'Đã xảy ra lỗi. Vui lòng thử lại';

      if (errorMessage !== 'canceled') {
        toast({
          title: 'Lỗi',
          description: errorMessage.toString(),
          variant: 'destructive',
        });
      }
    }

    return Promise.reject(error);
  },
);
export default api;
