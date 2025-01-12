import { Product } from "../product";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Coupon {
  name: string;
  code: string;
  discountType: "amount" | "percentage";
  discountValue: number;
}
