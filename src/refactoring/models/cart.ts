import { CartItem, Coupon, CartTotal } from "../../types";

// 할인 계산 결과를 위한 인터페이스
interface DiscountResult {
  discountedTotal: number;
  discountAmount: number;
}

// 쿠폰 할인 계산을 위한 함수
const calculateCouponDiscount = (
  total: number, 
  coupon: Coupon
): DiscountResult => {
  if (coupon.discountType === "percentage") {
    const discountAmount = total * (coupon.discountValue / 100);
    return {
      discountedTotal: total - discountAmount,
      discountAmount
    };
  } else {
    const discountAmount = Math.min(coupon.discountValue, total);
    return {
      discountedTotal: total - discountAmount,
      discountAmount
    };
  }
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null 
): CartTotal => {
   // 1. 상품 금액 합계 (할인 전)
  const totalBeforeDiscount = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // 2. 상품별 할인 적용 후 합계
  const totalAfterItemDiscount = cart.reduce(
    (sum, item) => sum + calculateItemTotal(item),
    0
  );

  // 3. 쿠폰 할인 적용
  const { discountedTotal: totalAfterDiscount, discountAmount: couponDiscount } = 
    selectedCoupon 
      ? calculateCouponDiscount(totalAfterItemDiscount, selectedCoupon)
      : { discountedTotal: totalAfterItemDiscount, discountAmount: 0 };

  // 4. 총 할인 금액 계산
  const totalDiscount = totalBeforeDiscount - totalAfterItemDiscount + couponDiscount;

  return {
    totalBeforeDiscount,
    totalAfterDiscount,
    totalDiscount,
  };
};

export const calculateItemTotal = (item: CartItem): number => {
  const { price } = item.product;
  const { quantity } = item;
  const maxDiscount = getMaxApplicableDiscount(item);
  
  return Math.round(price * quantity * (1 - maxDiscount));
};

export const getMaxApplicableDiscount = (item: CartItem): number => {
  const { discounts } = item.product;
  const { quantity } = item;
  
  return discounts.reduce(
    (maxDiscount, discount) =>
      quantity >= discount.quantity ? Math.max(maxDiscount, discount.rate) : maxDiscount,
    0
  );
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  if (newQuantity <= 0) {
    // 새로운 수량이 0 이하이면 해당 항목 제거
    return cart.filter((item) => item.product.id !== productId);
  }

  // 수량이 0 이상인 경우 항목 업데이트
  return cart.map((item) =>
    item.product.id === productId
      ? { ...item, quantity: Math.min(newQuantity, item.product.stock) }
      : item
  );
};