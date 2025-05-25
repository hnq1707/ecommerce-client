'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, CreditCard, ShieldCheck, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { OrderSummary } from './order-summary';
import { AddressSelection } from '../address/address-selection';
import { CouponSelector } from '../coupon/coupon-selector';
import { useDispatch, useSelector } from 'react-redux';
import {
  createOrder,
  type OrderRequest,
  selectCurrentOrder,
  selectOrderError,
  selectOrderLoading,
} from '@/lib/redux/features/order/orderSlice';
import type { AppDispatch } from '@/lib/redux/store';
import { useUsers } from '@/lib/redux/features/user/useUser';
import { useSession } from 'next-auth/react';
import type { Address } from '@/lib/types/Address';
import { useCartStore } from '@/lib/redux/features/cart/useCartStore';
import type { CartItem } from '@/lib/types/CartItem';
import type { Coupon } from '@/lib/utils/coupon-service';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const { data: session } = useSession();
  const { user, fetchUser } = useUsers();
  const { cartItems, totalPrice, totalQuantity } = useCartStore();

  useEffect(() => {
    if (session?.user?.id) {
      fetchUser(session.user.id);
    }
  }, [session?.user?.id, fetchUser]);

  useEffect(() => {
    if (user?.addressList) {
      setAddresses(user.addressList);
      // Chỉ tự động chọn địa chỉ đầu tiên nếu không có địa chỉ nào được chọn
      if (user.addressList.length > 0 && !selectedAddressId) {
        // Ưu tiên chọn địa chỉ mặc định nếu có
        setSelectedAddressId(user.addressList[0].id);

      }
    }
  }, [user?.addressList, selectedAddressId]);

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
    // Đánh dấu rằng đã hoàn thành việc thêm địa chỉ
    setIsAddingAddress(false);

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

  // Hàm xử lý áp dụng coupon từ CouponSelector
  const handleApplyCoupon = (coupon: Coupon, discount: number) => {
    setAppliedCoupon(coupon);
    setDiscountAmount(discount);
  };

  // Hàm xử lý xóa coupon
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra nếu đang trong quá trình thêm địa chỉ, không cho phép đặt hàng
    if (isAddingAddress) {
      toast({
        title: 'Thông báo',
        description: 'Vui lòng hoàn thành việc thêm địa chỉ trước khi đặt hàng',
        variant: 'default',
      });
      return;
    }

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
        description: 'Vui lòng chọn phương thức thanh toán',
        variant: 'destructive',
      });
      return;
    }

    // Chuẩn bị yêu cầu đặt hàng
    const orderRequest: OrderRequest = {
      userId: session?.user?.id || '',
      addressId: selectedAddressId,
      totalAmount: totalQuantity,
      totalPrice: totalPrice - discountAmount,
      orderDate: new Date(),
      discount: discountAmount,
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

  const formatCurrency = (amount: number) => {
    amount = amount * 23000;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };


  return (
    <form onSubmit={handleSubmit} className="pb-12">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Địa Chỉ Giao Hàng</CardTitle>
                  <CardDescription>Chọn nơi bạn muốn giao đơn hàng</CardDescription>
                </div>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  1
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <AddressSelection
                addresses={addresses}
                selectedAddressId={selectedAddressId}
                onSelectAddress={setSelectedAddressId}
                onAddressAdded={handleAddressAdded}
                onAddressDialogOpen={() => setIsAddingAddress(true)}
                onAddressDialogClose={() => setIsAddingAddress(false)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Phương Thức Thanh Toán</CardTitle>
                  <CardDescription>Chọn cách bạn muốn thanh toán</CardDescription>
                </div>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  2
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="space-y-4"
              >
                <div
                  className="flex items-center space-x-2 border rounded-md p-4 hover:border-primary transition-colors">
                  <RadioGroupItem value="CARD" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer w-full">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-blue-500" />
                        <span>Thẻ Tín Dụng/Ghi Nợ</span>
                      </div>
                      <ShieldCheck className="h-5 w-5 text-green-500" />
                    </div>
                  </Label>
                </div>
                <div
                  className="flex items-center space-x-2 border rounded-md p-4 hover:border-primary transition-colors">
                  <RadioGroupItem value="COD" id="cod" />
                  <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer w-full">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <Truck className="h-5 w-5 text-orange-500" />
                        <span>Thanh Toán Khi Nhận Hàng</span>
                      </div>
                      <Clock className="h-5 w-5 text-gray-500" />
                    </div>
                  </Label>
                </div>
              </RadioGroup>

              {paymentMethod === 'CARD' && (
                <Alert className="mt-4 bg-blue-50 border-blue-200">
                  <CreditCard className="h-4 w-4 text-blue-500" />
                  <AlertTitle>Thanh toán an toàn</AlertTitle>
                  <AlertDescription>
                    Thông tin thẻ của bạn được bảo mật và mã hóa an toàn. Chúng tôi không lưu trữ
                    thông tin thẻ của bạn.
                  </AlertDescription>
                </Alert>
              )}

              {paymentMethod === 'COD' && (
                <Alert className="mt-4 bg-orange-50 border-orange-200">
                  <Truck className="h-4 w-4 text-orange-500" />
                  <AlertTitle>Thanh toán khi nhận hàng</AlertTitle>
                  <AlertDescription>
                    Bạn sẽ thanh toán khi nhận được hàng. Vui lòng chuẩn bị đúng số tiền để giao
                    dịch thuận tiện.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Sử dụng component CouponSelector */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Mã Giảm Giá</CardTitle>
                  <CardDescription>Áp dụng mã giảm giá cho đơn hàng</CardDescription>
                </div>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  3
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CouponSelector
                orderAmount={totalPrice}
                onApplyCoupon={handleApplyCoupon}
                onRemoveCoupon={handleRemoveCoupon}
                appliedCoupon={appliedCoupon}
              />
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
                discount={discountAmount}
                total={totalPrice - discountAmount}
              />
            </CardContent>
            <Separator />
            <CardFooter className="pt-6">
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading || isAddingAddress || !selectedAddressId || !paymentMethod}
              >
                {isLoading
                  ? 'Đang xử lý...'
                  : `Đặt Hàng • ${formatCurrency(totalPrice - discountAmount)}`}
              </Button>
            </CardFooter>
            {(isAddingAddress || !selectedAddressId || !paymentMethod) && (
              <div className="px-6 pb-6 text-sm text-amber-600">
                {isAddingAddress && 'Vui lòng hoàn thành việc thêm địa chỉ trước khi đặt hàng'}
                {!isAddingAddress && !selectedAddressId && 'Vui lòng chọn địa chỉ giao hàng'}
                {!isAddingAddress &&
                  selectedAddressId &&
                  !paymentMethod &&
                  'Vui lòng chọn phương thức thanh toán'}
              </div>
            )}
          </Card>
        </div>
      </div>
    </form>
  );
}
