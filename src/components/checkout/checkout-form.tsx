'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { OrderSummary } from './order-summary';
import { AddressSelection } from './address-selection';
import { useDispatch, useSelector } from 'react-redux';
import {
  createOrder,
  selectCurrentOrder,
  selectOrderError,
  selectOrderLoading,
  type OrderRequest,
} from '@/lib/redux/features/order/orderSlice';
import { AppDispatch } from '@/lib/redux/store';
import { useUsers } from '@/lib/redux/features/user/useUser';
import { useSession } from 'next-auth/react';
import { Address } from '@/lib/type/Address';
import { useCartStore } from '@/lib/redux/features/cart/useCartStore';
import { CartItem } from '@/lib/type/CartItem';

export default function CheckoutForm() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();

  // Redux state
  const isLoading = useSelector(selectOrderLoading);
  const error = useSelector(selectOrderError);
  const currentOrder = useSelector(selectCurrentOrder);

  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [discount] = useState(0);
  const { data: session } = useSession();
  const { user, fetchUser } = useUsers();
  const { cartItems, totalPrice, totalQuantity } = useCartStore();
  useEffect(() => {
    if (session?.user?.id) {
      fetchUser(session.user.id);
    }
  }, [session?.user?.id]);
  useEffect(() => {
    if (user?.addressList) {
      setAddresses(user.addressList);
      if (user.addressList.length > 0 && !selectedAddressId) {
        setSelectedAddressId(user.addressList[0].id);
      }
    }
  }, [user?.addressList]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Lỗi',
        description: error,
        variant: 'destructive',
      });
    }
  }, [error, toast]);
  const handleAddressAdded = () => {
    // Gọi lại fetchUser để lấy danh sách địa chỉ mới nhất
    if (session?.user?.id) {
      fetchUser(session.user.id);
    }
  };
  useEffect(() => {

    // Chỉ xử lý nếu currentOrder tồn tại và paymentMethod là CARD hoặc COD
    if (
      currentOrder &&
      (currentOrder.paymentMethod === 'CARD' || currentOrder.paymentMethod === 'COD')
    ) {
      if (currentOrder.paymentMethod === 'CARD' && currentOrder.credentials?.client_secret) {
        router.push(
          `/payment/${currentOrder.orderId}?clientSecret=${encodeURIComponent(
            currentOrder.credentials.client_secret,
          )}`,
        );
      } else {
        toast({
          title: 'Đặt Hàng Thành Công',
          description: 'Đơn hàng của bạn đã được đặt thành công',
          variant: 'default',
        });
        router.push(`/orders/${currentOrder.orderId}/confirmation`);
      }
    }
  }, [currentOrder, router, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAddressId) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng chọn địa chỉ giao hàng',
        variant: 'destructive',
      });
      return;
    }

    // Kiểm tra paymentMethod có hợp lệ hay không
    if (!(paymentMethod === 'CARD' || paymentMethod === 'COD')) {
      toast({
        title: 'Lỗi',
        description: 'Phương thức thanh toán không hợp lệ',
        variant: 'destructive',
      });
      return;
    }

    // Chuẩn bị yêu cầu đặt hàng
    const orderRequest: OrderRequest = {
      userId: session?.user?.id || '',
      addressId: selectedAddressId,
      totalAmount: totalQuantity,
      totalPrice: totalPrice - discount,
      orderDate: new Date(),
      discount: discount,
      expectedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      paymentMethod: paymentMethod,
      orderItemRequests: cartItems.map((item: CartItem) => ({
        productId: item.id,
        productVariantId: item.productVariants.id,
        price: item.price,
        quantity: item.quantity,
      })),
    };

    // Dispatch action để tạo đơn hàng
    dispatch(createOrder(orderRequest));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Địa Chỉ Giao Hàng</CardTitle>
              <CardDescription>Chọn nơi bạn muốn giao đơn hàng</CardDescription>
            </CardHeader>
            <CardContent>
              <AddressSelection
                addresses={addresses}
                selectedAddressId={selectedAddressId}
                onSelectAddress={setSelectedAddressId}
                onAddressAdded={handleAddressAdded}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Phương Thức Thanh Toán</CardTitle>
              <CardDescription>Chọn cách bạn muốn thanh toán</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                defaultValue={paymentMethod}
                onValueChange={setPaymentMethod}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2 border rounded-md p-4">
                  <RadioGroupItem value="CARD" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                    <CreditCard className="h-5 w-5" />
                    <span>Thẻ Tín Dụng/Ghi Nợ</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-4">
                  <RadioGroupItem value="COD" id="cod" />
                  <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer">
                    <Truck className="h-5 w-5" />
                    <span>Thanh Toán Khi Nhận Hàng</span>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-xl">Tóm Tắt Đơn Hàng</CardTitle>
              <CardDescription>Xem lại các mặt hàng của bạn</CardDescription>
            </CardHeader>
            <CardContent>
              <OrderSummary
                items={cartItems}
                subtotal={totalPrice}
                discount={discount}
                total={totalPrice - discount}
              />
            </CardContent>
            <Separator />
            <CardFooter className="pt-6">
              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? 'Đang xử lý...' : `Đặt Hàng • $${(totalPrice - discount).toFixed(2)}`}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </form>
  );
}
