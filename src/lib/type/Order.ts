import { Address } from "./Address";
import { Product } from "./Product";

export interface OrderItem {
  id: string;
  product: Product;
  productVariantId: string;
  quantity: number;
  itemPrice: number;
}

export interface Order {
  id: string;
  orderDate: string;
  address: Address;
  totalPrice: number;
  totalAmount: number;
  orderStatus: string;
  paymentMethod: string;
  shipmentNumber: string;
  expectedDeliveryDate: string;
  orderItemList: OrderItem[];
}
