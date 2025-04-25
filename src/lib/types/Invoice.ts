import { Address } from "./Address";
import { Order } from "./Order";

export interface Invoice {
  id: string;
  order: Order;
  totalAmount: number;
  totalPrice: number;
  issuedDate: string;
  billingAddress: Address;
  isPaid: boolean;
}
