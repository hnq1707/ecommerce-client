'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/lib/utils/api';
import { signOut } from 'next-auth/react';
import { useAuth } from '@/lib/redux/features/auth/useAuth';

const formSchema = z
  .object({
    oldPassword: z.string().min(1, { message: 'Vui lòng nhập mật khẩu hiện tại' }),
    newPassword: z
      .string()
      .min(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
      .regex(/[a-z]/, { message: 'Mật khẩu phải chứa ít nhất một chữ cái thường' })
      .regex(/[A-Z]/, { message: 'Mật khẩu phải chứa ít nhất một chữ cái hoa' })
      .regex(/[0-9]/, { message: 'Mật khẩu phải chứa ít nhất một chữ số' })
      .regex(/[^a-zA-Z0-9]/, { message: 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt' }),
    confirmPassword: z.string().min(1, { message: 'Vui lòng xác nhận mật khẩu mới' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof formSchema>;

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { data: session, status } = useSession();
  const { logout } = useAuth();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      toast({
        variant: 'destructive',
        title: 'Không được phép',
        description: 'Vui lòng đăng nhập để thay đổi mật khẩu',
      });
    }
  }, [status, router, toast]);
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
  async function onSubmit(data: FormValues) {
    if (!session?.user?.email) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể xác định email người dùng. Vui lòng đăng nhập lại.',
      });
      return;
    }

    // Validate mật khẩu mới
    if (data.newPassword !== data.confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Mật khẩu mới và xác nhận mật khẩu không khớp',
      });
      return;
    }

    // Validate độ dài và độ phức tạp của mật khẩu
    if (data.newPassword.length < 8) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Mật khẩu mới phải có ít nhất 8 ký tự',
      });
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/api/auth/reset-password', {
        email: session.user.email,
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });

      toast({
        title: 'Thành công',
        description: 'Mật khẩu của bạn đã được thay đổi thành công. Vui lòng đăng nhập lại.',
        duration: 5000,
      });


      setIsSuccess(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.';

        // Xử lý các mã lỗi cụ thể
        if (error.response?.status === 401) {
          toast({
            variant: 'destructive',
            title: 'Lỗi',
            description: 'Mật khẩu hiện tại không đúng',
          });
        } else {
          toast({
            variant: 'destructive',
            title: 'Lỗi',
            description: errorMessage,
          });
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.',
        });
      }
    } finally {
     
      setIsLoading(false);
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Thay Đổi Mật Khẩu</CardTitle>
          <CardDescription className="text-center">
            Thay đổi mật khẩu cho tài khoản {session?.user?.email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Thay đổi mật khẩu thành công</h3>
              <p className="text-sm text-gray-500">
                Mật khẩu của bạn đã được cập nhật. Bạn có thể đăng nhập bằng mật khẩu mới.
              </p>
              <Button className="mt-4" onClick={handleLogout} disabled={isLoading}>
                Đăng nhập
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu hiện tại</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            placeholder="Nhập mật khẩu hiện tại"
                            type={showOldPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowOldPassword(!showOldPassword)}
                        >
                          {showOldPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {showOldPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                          </span>
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu mới</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            placeholder="Nhập mật khẩu mới"
                            type={showNewPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {showNewPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                          </span>
                        </Button>
                      </div>
                      <FormDescription className="text-xs">
                        Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự
                        đặc biệt.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            placeholder="Xác nhận mật khẩu mới"
                            type={showConfirmPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                          </span>
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || status !== 'authenticated'}
                >
                  {isLoading ? 'Đang xử lý...' : 'Thay đổi mật khẩu'}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/login" className="text-sm font-medium text-primary hover:underline">
            Quay lại đăng nhập
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
