export const DISCOUNT_TYPE_AMOUNT = "amount";
export const DISCOUNT_TYPE_PERCENTAGE = "percentage";

export type DiscountType =
  | typeof DISCOUNT_TYPE_AMOUNT
  | typeof DISCOUNT_TYPE_PERCENTAGE;

export interface Coupon {
  name: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  discounts: Array<Discount>;
}

export interface Discount {
  quantity: number;
  rate: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
