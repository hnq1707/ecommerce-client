'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type Coupon, createCoupon, updateCoupon } from '@/lib/utils/coupon-service';

// Schema validation cho form
const formSchema = z.object({
  code: z
    .string()
    .min(3, 'Mã giảm giá phải có ít nhất 3 ký tự')
    .max(20, 'Mã giảm giá không được quá 20 ký tự'),
  description: z.string().optional(),
  discountType: z.enum(['PERCENTAGE', 'FIXED_AMOUNT'], {
    required_error: 'Vui lòng chọn loại giảm giá',
  }),
  discountValue: z.coerce.number().positive('Giá trị giảm giá phải lớn hơn 0'),
  minimumPurchaseAmount: z.coerce
    .number()
    .nonnegative('Giá trị tối thiểu không được âm')
    .optional(),
  maximumDiscountAmount: z.coerce.number().nonnegative('Giá trị tối đa không được âm').optional(),
  startDate: z.date({
    required_error: 'Vui lòng chọn ngày bắt đầu',
  }),
  endDate: z.date({
    required_error: 'Vui lòng chọn ngày kết thúc',
  }),
  isActive: z.boolean().default(true),
  usageLimit: z.coerce
    .number()
    .int('Giới hạn sử dụng phải là số nguyên')
    .nonnegative('Giới hạn sử dụng không được âm')
    .optional(),
  couponType: z.enum(['GENERAL', 'PRODUCT', 'CATEGORY', 'USER'], {
    required_error: 'Vui lòng chọn loại coupon',
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface CouponFormProps {
  coupon?: Coupon | null;
  onSave: () => void;
  onCancel: () => void;
}

export function CouponForm({ coupon, onSave, onCancel }: CouponFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  // Khởi tạo form với giá trị mặc định hoặc giá trị từ coupon đã có
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
      description: '',
      discountType: 'PERCENTAGE',
      discountValue: 0,
      minimumPurchaseAmount: undefined,
      maximumDiscountAmount: undefined,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 ngày sau
      isActive: true,
      usageLimit: undefined,
      couponType: 'GENERAL',
    },
  });

  // Cập nhật giá trị form khi coupon thay đổi
  useEffect(() => {
    if (coupon) {
      form.reset({
        code: coupon.code,
        description: coupon.description || '',
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minimumPurchaseAmount: coupon.minimumPurchaseAmount,
        maximumDiscountAmount: coupon.maximumDiscountAmount,
        startDate: new Date(coupon.startDate),
        endDate: new Date(coupon.endDate),
        isActive: coupon.isActive,
        usageLimit: coupon.usageLimit,
        couponType: coupon.couponType || 'GENERAL',
      });
    }
  }, [coupon, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);

      // Chuyển đổi đối tượng Date thành chuỗi ISO
      const payload = {
        ...values,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
      };

      if (coupon) {
        // Cập nhật coupon đã có
        await updateCoupon(coupon.id, {
          ...payload,
          id: coupon.id,
          usageCount: coupon.usageCount || 0,
          description: payload.description || '', // Ensure description is always a string
        });
      } else {
        // Tạo coupon mới
        await createCoupon({
          ...payload,
          usageCount: 0,
          description: payload.description || '', // Ensure description is always a string
        });
      }

      onSave();
    } catch (error) {
      console.error('Error saving coupon:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{coupon ? 'Chỉnh sửa mã giảm giá' : 'Tạo mã giảm giá mới'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
                <TabsTrigger value="advanced">Thông tin nâng cao</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mã giảm giá</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập mã giảm giá" {...field} />
                        </FormControl>
                        <FormDescription>
                          Mã giảm giá sẽ được hiển thị cho người dùng
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Trạng thái</FormLabel>
                          <FormDescription>Kích hoạt hoặc vô hiệu hóa mã giảm giá</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Mô tả về mã giảm giá"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="discountType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loại giảm giá</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn loại giảm giá" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="PERCENTAGE">Phần trăm (%)</SelectItem>
                            <SelectItem value="FIXED_AMOUNT">Số tiền cố định</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="discountValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giá trị giảm giá</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder={
                              form.watch('discountType') === 'PERCENTAGE'
                                ? 'Nhập phần trăm'
                                : 'Nhập số tiền'
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {form.watch('discountType') === 'PERCENTAGE'
                            ? 'Giá trị từ 1-100'
                            : 'Số tiền giảm giá'}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Ngày bắt đầu</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className="w-full pl-3 text-left font-normal"
                              >
                                {field.value ? (
                                  format(field.value, 'dd/MM/yyyy', { locale: vi })
                                ) : (
                                  <span>Chọn ngày</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Ngày kết thúc</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className="w-full pl-3 text-left font-normal"
                              >
                                {field.value ? (
                                  format(field.value, 'dd/MM/yyyy', { locale: vi })
                                ) : (
                                  <span>Chọn ngày</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="minimumPurchaseAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giá trị đơn hàng tối thiểu</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Nhập giá trị tối thiểu"
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormDescription>Để trống nếu không có giới hạn tối thiểu</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maximumDiscountAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giá trị giảm giá tối đa</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Nhập giá trị tối đa"
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormDescription>Để trống nếu không có giới hạn tối đa</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="usageLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giới hạn sử dụng</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Nhập giới hạn sử dụng"
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormDescription>Để trống nếu không có giới hạn sử dụng</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="couponType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loại áp dụng</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn loại áp dụng" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="GENERAL">Tất cả</SelectItem>
                            <SelectItem value="PRODUCT">Sản phẩm cụ thể</SelectItem>
                            <SelectItem value="CATEGORY">Danh mục cụ thể</SelectItem>
                            <SelectItem value="USER">Người dùng cụ thể</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Chọn đối tượng áp dụng mã giảm giá</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Đang lưu...' : coupon ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
