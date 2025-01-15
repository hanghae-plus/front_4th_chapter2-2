export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  discounts: Discount[];
}

export interface Discount {
  quantity: number;
  rate: number;
}

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

// 계산 결과를 위한 인터페이스 정의
export interface CartTotal {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
  totalDiscount: number;
}

export interface OrderSummaryProps {
  summary: CartTotal;
}