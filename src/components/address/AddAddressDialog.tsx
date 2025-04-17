/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import api from '@/lib/utils/api';
import { Checkbox } from '@/components/ui/checkbox';

// Định nghĩa các kiểu dữ liệu từ API
interface Province {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  phone_code: number;
}

interface District {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  province_code: number;
}



const addressSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên người nhận'),
  street: z.string().min(1, 'Vui lòng nhập địa chỉ'),
  provinceCode: z.string().min(1, 'Vui lòng chọn tỉnh/thành phố'),
  districtCode: z.string().min(1, 'Vui lòng chọn quận/huyện'),
  zipCode: z.string().min(1, 'Vui lòng nhập mã bưu điện'),
  phoneNumber: z.string().regex(/^\d{10,11}$/, 'Số điện thoại không hợp lệ'),
  isDefault: z.boolean().default(false),
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface AddAddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddressAdded: () => void;
  onClose?: () => void; // Thêm prop onClose để xử lý khi đóng dialog
}

export function AddAddressDialog({
  open,
  onOpenChange,
  onAddressAdded,
  onClose,
}: AddAddressDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: '',
      street: '',
      provinceCode: '',
      districtCode: '',
      zipCode: '',
      phoneNumber: '',
      isDefault: false,
    },
  });

  // Lấy danh sách tỉnh/thành phố khi component được mount
  useEffect(() => {
    if (open) {
      fetchProvinces();
    }
  }, [open]);

  // Lấy danh sách quận/huyện khi tỉnh/thành phố thay đổi
  useEffect(() => {
    const provinceCode = form.watch('provinceCode');
    if (provinceCode) {
      fetchDistricts(Number.parseInt(provinceCode));
      // Reset quận/huyện và phường/xã khi thay đổi tỉnh/thành phố
      form.setValue('districtCode', '');
    }
  }, [form.watch('provinceCode')]);

  
  // Hàm lấy danh sách tỉnh/thành phố
  const fetchProvinces = async () => {
    setIsLoadingProvinces(true);
    try {
      const response = await fetch('https://provinces.open-api.vn/api/p/');
      if (!response.ok) {
        throw new Error('Không thể lấy danh sách tỉnh/thành phố');
      }
      const data = await response.json();
      setProvinces(data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tỉnh/thành phố:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể lấy danh sách tỉnh/thành phố. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingProvinces(false);
    }
  };

  // Hàm lấy danh sách quận/huyện theo tỉnh/thành phố
  const fetchDistricts = async (provinceCode: number) => {
    setIsLoadingDistricts(true);
    try {
      const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
      if (!response.ok) {
        throw new Error('Không thể lấy danh sách quận/huyện');
      }
      const data = await response.json();
      setDistricts(data.districts || []);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách quận/huyện:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể lấy danh sách quận/huyện. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingDistricts(false);
    }
  };

  

  // Hàm xử lý khi đóng dialog
  const handleCloseDialog = () => {
    form.reset(); // Reset form khi đóng dialog
    onOpenChange(false);
    if (onClose) {
      onClose();
    }
  };

  // Hàm xử lý khi submit form
  async function onSubmit(values: AddressFormValues) {
    setIsSubmitting(true);

    // Tìm tên tỉnh/thành phố, quận/huyện, phường/xã từ code
    const province = provinces.find((p) => p.code === Number.parseInt(values.provinceCode));
    const district = districts.find((d) => d.code === Number.parseInt(values.districtCode));

    try {
      // Tạo đối tượng địa chỉ để gửi lên server
      const addressData = {
        name: values.name,
        street: values.street,
        district: district?.name || '',
        city: province?.name || '',
        zipCode: values.zipCode,
        phoneNumber: values.phoneNumber,
        provinceCode: Number.parseInt(values.provinceCode),
        districtCode: Number.parseInt(values.districtCode),
        isDefault: values.isDefault,
      };

      const response = await api.post('/api/address', addressData);

      if (response.status === 201 || response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Địa chỉ đã được thêm thành công!',
        });
        form.reset();
        handleCloseDialog();
        onAddressAdded();
      } else {
        throw new Error('Không thể thêm địa chỉ. Vui lòng thử lại.');
      }
    } catch (error: any) {
      console.error('Lỗi khi thêm địa chỉ:', error);
      toast({
        title: 'Lỗi',
        description: error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleCloseDialog}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm địa chỉ mới</DialogTitle>
          <DialogDescription>Nhập thông tin địa chỉ giao hàng của bạn.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên người nhận</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên người nhận" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập số điện thoại" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Chọn tỉnh/thành phố */}
            <FormField
              control={form.control}
              name="provinceCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tỉnh/Thành phố</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoadingProvinces}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn tỉnh/thành phố" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingProvinces ? (
                        <div className="flex items-center justify-center p-2">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          <span>Đang tải...</span>
                        </div>
                      ) : (
                        provinces.map((province) => (
                          <SelectItem key={province.code} value={province.code.toString()}>
                            {province.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Chọn quận/huyện */}
            <FormField
              control={form.control}
              name="districtCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quận/Huyện</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!form.watch('provinceCode') || isLoadingDistricts}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn quận/huyện" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingDistricts ? (
                        <div className="flex items-center justify-center p-2">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          <span>Đang tải...</span>
                        </div>
                      ) : (
                        districts.map((district) => (
                          <SelectItem key={district.code} value={district.code.toString()}>
                            {district.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

           
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ cụ thể</FormLabel>
                  <FormControl>
                    <Input placeholder="Số nhà, tên đường, tổ/xóm" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã bưu điện</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập mã bưu điện" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isDefault"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Đặt làm địa chỉ mặc định</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Địa chỉ này sẽ được chọn tự động cho các đơn hàng tiếp theo
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  'Lưu địa chỉ'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
