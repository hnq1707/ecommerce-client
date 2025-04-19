'use client';

import { useState } from 'react';
import Link from 'next/link';
import { z } from 'zod';
import { Mail } from 'lucide-react';
import axios from 'axios';

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

const formSchema = z.object({
  email: z.string().email({ message: 'Vui lòng nhập địa chỉ email hợp lệ' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    try {
      await api.post('/api/auth/forget-password', { email: data.email });

      // Axios automatically throws for non-2xx responses, so if we get here, it's a success
      setIsSuccess(true);
      toast({
        title: 'Thành công',
        description: `Đã gửi liên kết đặt lại mật khẩu đến ${data.email}`,
        duration: 5000,
      });
    } catch (error) {
      // Axios error handling
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.';
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: errorMessage,
        });
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Quên Mật Khẩu</CardTitle>
          <CardDescription className="text-center">
            Nhập địa chỉ email của bạn và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Kiểm tra email của bạn</h3>
              <p className="text-sm text-gray-500">
                Chúng tôi đã gửi liên kết đặt lại mật khẩu đến{' '}
                <span className="font-medium">{form.getValues().email}</span>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Nếu bạn không thấy email trong hộp thư đến, vui lòng kiểm tra thư mục spam.
              </p>
              <Button variant="outline" className="mt-4" onClick={() => setIsSuccess(false)}>
                Gửi đến email khác
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập địa chỉ email của bạn"
                          type="email"
                          autoComplete="email"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Đang gửi...' : 'Đặt Lại Mật Khẩu'}
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
