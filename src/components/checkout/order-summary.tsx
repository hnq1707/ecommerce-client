import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { CartItem } from '@/lib/type/CartItem';

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
}

export function OrderSummary({ items, subtotal, discount, total }: OrderSummaryProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {items.map((item) => {
          // Kiểm tra resources có tồn tại không và có phải mảng không
          
          return (
            <div key={item.id} className="flex items-start gap-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-md border">
                <Image
                  src={item.thumbnail || '/placeholder.svg'}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-muted-foreground">SL: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">${item.price.toFixed(2)}</p>
                {item.quantity > 1 && (
                  <p className="text-sm text-muted-foreground">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Separator />

      <div className="space-y-2">
        <div className="flex justify-between">
          <p className="text-muted-foreground">Tạm tính</p>
          <p className="font-medium">${subtotal.toFixed(2)}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-muted-foreground">Giảm giá</p>
          <p className="font-medium text-green-600">-${discount.toFixed(2)}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-muted-foreground">Phí vận chuyển</p>
          <p className="font-medium">Miễn phí</p>
        </div>
        <Separator />
        <div className="flex justify-between font-medium">
          <p>Tổng cộng</p>
          <p>${total.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
