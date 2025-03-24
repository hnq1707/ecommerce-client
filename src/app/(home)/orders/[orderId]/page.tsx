'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { getOrderDetails } from '@/lib/redux/features/order/orderSlice';
import { ArrowLeft, Package, Truck, MapPin, Calendar, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import Image from 'next/image';
import { OrderCancelButton } from '@/components/orders/order-cancel-button';

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const { orderDetails: order, loading, error } = useSelector((state: RootState) => state.order);
  useEffect(() => {
    if (orderId) {
      dispatch(getOrderDetails(orderId as string));
    }
  }, [orderId, dispatch]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    amount = amount * 23000;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };


  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge className="bg-yellow-500">Đang xử lý</Badge>;
      case 'IN_PROGRESS':
        return <Badge className="bg-blue-500">Đã xác nhận</Badge>;
      case 'SHIPPED':
        return <Badge className="bg-indigo-500">Đang giao hàng</Badge>;
      case 'DELIVERED':
        return <Badge className="bg-green-500">Đã giao hàng</Badge>;
      case 'CANCELLED':
        return <Badge className="bg-red-500">Đã hủy</Badge>;
      default:
        return <Badge className="bg-gray-500">Không xác định</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Lỗi</h1>
          <p>{error || 'Không tìm thấy thông tin đơn hàng'}</p>
          <Button asChild className="mt-4">
            <Link href="/orders">Quay lại danh sách đơn hàng</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách đơn hàng
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Chi Tiết Đơn Hàng</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Đơn hàng #{order.id.substring(0, 8)}...</CardTitle>
              {getStatusBadge(order.orderStatus)}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span className="text-sm">Ngày đặt hàng:</span>
                  </div>
                  <span className="font-medium">{formatDate(order.orderDate)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span className="text-sm">Ngày giao hàng dự kiến:</span>
                  </div>
                  <span className="font-medium">{formatDate(order.expectedDeliveryDate)}</span>
                </div>

                {order.shipmentNumber && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Truck className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span className="text-sm">Mã vận đơn:</span>
                    </div>
                    <span className="font-medium">{order.shipmentNumber}</span>
                  </div>
                )}

                <Separator className="my-4" />

                <h3 className="font-semibold text-lg mb-2">Sản phẩm</h3>
                <div className="space-y-4">
                  {order.orderItemList.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start space-x-4 py-3 border-b last:border-0"
                    >
                      <div className="flex-shrink-0">
                        <Image
                          width={80}
                          height={80}
                          src={
                            item.product.thumbnail ||
                            '/placeholder.svg?height=80&width=80'
                          }
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium">{item.product.name}</h4>
                        <div className="text-sm text-muted-foreground mt-1">
                          {item.product.productVariants.find((v) => v.id === item.productVariantId)
                            ?.color && (
                            <span className="mr-2">
                              Màu:{' '}
                              {
                                item.product.productVariants.find(
                                  (v) => v.id === item.productVariantId,
                                )?.color
                              }
                            </span>
                          )}
                          {item.product.productVariants.find((v) => v.id === item.productVariantId)
                            ?.size && (
                            <span>
                              Size:{' '}
                              {
                                item.product.productVariants.find(
                                  (v) => v.id === item.productVariantId,
                                )?.size
                              }
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between mt-2">
                          <span className="text-sm">SL: {item.quantity}</span>
                          <span className="font-medium">{formatCurrency(item.itemPrice)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between items-center font-semibold">
                  <span>Tổng cộng</span>
                  <span className="text-lg">{formatCurrency(order.totalPrice)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin giao hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Người nhận</h3>
                  <p>{order.address.name}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-1 flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    Số điện thoại
                  </h3>
                  <p>{order.address.phoneNumber}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-1 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    Địa chỉ giao hàng
                  </h3>
                  <p>
                    {order.address.street}, {order.address.city}, {order.address.district}{' '}
                    {order.address.zipCode}
                  </p>
                </div>

                {order.orderStatus === 'SHIPPED' && (
                  <Button className="w-full mt-4">
                    <Package className="mr-2 h-4 w-4" />
                    Theo dõi đơn hàng
                  </Button>
                )}

                {order.orderStatus === 'PENDING' && (
                  <OrderCancelButton orderId={orderId as string} />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
