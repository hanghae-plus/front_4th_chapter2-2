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

export interface ProductListProps {
  products: Product[];
  addToCart: (product: Product) => void;
  getRemainingStock: (product: Product) => number;
  getMaxDiscount: Record<string, number>;
}

export interface CartDetailsProps {
  cart: { product: Product; quantity: number }[];
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  getAppliedDiscount: (item: { product: Product; quantity: number }) => number;
}

export interface CouponSectionProps {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  handleApplyCoupon: (index: number) => void;
}

export interface ProductFormProps {
  onProductAdd: (newProduct: Product) => void;
}

export interface AdminProductListProps {
  products: Product[];
  onProductUpdate: (updatedProduct: Product) => void;
  onProductAdd: (newProduct: Product) => void; 
}

export interface CouponListProps {
  coupons: Coupon[];
}

export interface CouponFormProps {
  onCouponAdd: (newCoupon: Coupon) => void;
}



