'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CheckCircle, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearCurrentOrder,
  getOrderDetails,
  selectOrderDetails,
  selectOrderLoading,
} from '@/lib/redux/features/order/orderSlice';
import { AppDispatch } from '@/lib/redux/store';
import Image from 'next/image';
import { OrderItem } from '@/lib/type/Order';
import { useCartStore } from '@/lib/redux/features/cart/useCartStore';

export default function OrderConfirmationPage() {
  const params = useParams();
  const { orderId } = params;
  const dispatch = useDispatch<AppDispatch>();
  const { clear } = useCartStore();
  // Redux state
  const orderDetails = useSelector(selectOrderDetails);
  const isLoading = useSelector(selectOrderLoading);
  const formatCurrency = (amount: number) => {
    amount = amount * 23000;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Lấy thông tin đơn hàng
  useEffect(() => {
    dispatch(getOrderDetails(orderId as string));
    clear();
    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [dispatch, orderId]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="text-center animate-fadeIn">
          <CardHeader>
            <CardTitle className="text-2xl">Đang tải...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="text-center w-full max-w-2xl shadow-lg animate-fadeIn">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-semibold">Đơn Hàng Đã Xác Nhận!</CardTitle>
          <CardDescription className="text-base">
            Cảm ơn bạn đã mua hàng! Đơn hàng của bạn đã được đặt thành công.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mã đơn hàng */}
          <div className="rounded-lg bg-muted p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <span className="font-medium">Mã Đơn Hàng:</span>
              </div>
              <span className="font-mono font-semibold text-primary">{orderId}</span>
            </div>
          </div>

          {/* Danh sách sản phẩm */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Sản phẩm trong đơn hàng</h2>
            <div className="max-h-80 overflow-y-auto space-y-3">
              {orderDetails?.orderItemList?.map((item: OrderItem) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 rounded-lg border bg-white shadow-sm"
                >
                  <Image
                    src={item.product.thumbnail || '/product.jpeg'}
                    alt={item.product.name}
                    width={60}
                    height={60}
                    className="rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground">Số lượng: {item.quantity}</p>
                  </div>
                  <span className="font-semibold">{formatCurrency(item.itemPrice)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ghi chú */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            Chúng tôi đã gửi email xác nhận với chi tiết đơn hàng và thông tin theo dõi. Bạn cũng có
            thể theo dõi đơn hàng trong phần{' '}
            <Link href="/orders" className="text-primary font-medium hover:underline">
              Đơn Hàng Của Tôi
            </Link>
            .
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 md:flex-row justify-center">
          <Button asChild className="w-full md:w-40" onClick={() => dispatch(clearCurrentOrder())}>
            <Link href="/orders">Xem Đơn Hàng</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full md:w-40"
            onClick={() => dispatch(clearCurrentOrder())}
          >
            <Link href="/">Tiếp Tục Mua Sắm</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
