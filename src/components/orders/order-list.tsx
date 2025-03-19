'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { Package, ShoppingBag, Truck, CheckCircle, XCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { OrderCancelButton } from './order-cancel-button';
import { motion } from 'framer-motion';

import type { Order, OrderItem } from '@/lib/type/Order';

interface OrderListProps {
  orders: Order[] | undefined;
}

export default function OrderList({ orders = [] }: OrderListProps) {
  if (!orders || orders.length === 0) {
    return <p>Đang tải danh sách đơn hàng...</p>;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Đang xử lý
          </Badge>
        );
      case 'IN_PROGRESS':
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            Đã xác nhận
          </Badge>
        );
      case 'SHIPPED':
        return (
          <Badge variant="outline" className="bg-indigo-100 text-indigo-800 border-indigo-200">
            Đang giao hàng
          </Badge>
        );
      case 'DELIVERED':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            Đã giao hàng
          </Badge>
        );
      case 'CANCELLED':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            Đã hủy
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <ShoppingBag className="h-5 w-5 text-yellow-500" />;
      case 'CONFIRMED':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'SHIPPED':
        return <Truck className="h-5 w-5 text-indigo-500" />;
      case 'DELIVERED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'CANCELLED':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {orders.map((order, index) => {
        const formattedOrder: Order = {
          id: order.id,
          orderDate: order.orderDate,
          totalAmount: order.totalAmount,
          totalPrice: order.totalPrice,
          orderStatus: order.orderStatus,
          expectedDeliveryDate: order.expectedDeliveryDate,
          orderItemList: order.orderItemList.map((item: OrderItem) => ({
            id: item.id,
            product: item.product,
            productVariantId: item.productVariantId,
            quantity: item.quantity,
            itemPrice: item.itemPrice,
          })),
          address: order.address,
          shipmentNumber: order.shipmentNumber,
          paymentMethod: order.paymentMethod,
        };

        return (
          <motion.div
            key={formattedOrder.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card
              className="overflow-hidden border-l-4 hover:shadow-md transition-shadow duration-200"
              style={{
                borderLeftColor:
                  formattedOrder.orderStatus === 'PENDING'
                    ? '#eab308'
                    : formattedOrder.orderStatus === 'CONFIRMED'
                    ? '#3b82f6'
                    : formattedOrder.orderStatus === 'SHIPPED'
                    ? '#6366f1'
                    : formattedOrder.orderStatus === 'DELIVERED'
                    ? '#22c55e'
                    : formattedOrder.orderStatus === 'CANCELLED'
                    ? '#ef4444'
                    : '#e5e7eb',
              }}
            >
              <CardHeader className="flex flex-row items-center justify-between py-4">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    Đơn hàng #{formattedOrder.id}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Đặt ngày {format(new Date(formattedOrder.orderDate), 'dd/MM/yyyy')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(formattedOrder.orderStatus)}
                  {getStatusBadge(formattedOrder.orderStatus)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div>
                      <p className="text-sm font-medium">Ngày giao hàng dự kiến</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(formattedOrder.expectedDeliveryDate), 'dd/MM/yyyy')}
                      </p>
                    </div>

                    {formattedOrder.shipmentNumber && (
                      <div className="text-right">
                        <p className="text-sm font-medium">Mã vận đơn</p>
                        <p className="text-sm text-muted-foreground">
                          {formattedOrder.shipmentNumber}
                        </p>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm font-medium mb-2">
                      Sản phẩm ({formattedOrder.orderItemList.length})
                    </p>
                    <ul className="space-y-2">
                      {formattedOrder.orderItemList.slice(0, 2).map((item) => (
                        <li key={item.id} className="flex justify-between text-sm">
                          <span className="line-clamp-1">
                            {item.product.name} x{item.quantity}
                          </span>
                          <span className="font-medium">
                            ${((item.product.price ?? 0) * (item.quantity ?? 0)).toFixed(2)}
                          </span>
                        </li>
                      ))}
                      {formattedOrder.orderItemList.length > 2 && (
                        <li className="text-sm text-muted-foreground">
                          + {formattedOrder.orderItemList.length - 2} sản phẩm khác
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="flex justify-between font-medium">
                    <span>Tổng cộng</span>
                    <span className="text-lg">${(formattedOrder.totalPrice ?? 0).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 py-4 bg-muted/10">
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <Link href={`/orders/${formattedOrder.id}`} className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Xem chi tiết
                  </Link>
                </Button>

                {formattedOrder.orderStatus === 'PENDING' && (
                  <OrderCancelButton orderId={formattedOrder.id}/>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
