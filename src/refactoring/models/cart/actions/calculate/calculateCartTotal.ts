import { CartItem, Coupon } from "../../types";
import { applyCouponDiscount } from "./discounts";
import { calculateItemTotal } from "./itemCalculator";

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  // 1. 할인 전 총액 계산
  const totalBeforeDiscount = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // 2. 수량 할인 적용
  const totalAfterQuantityDiscount = cart.reduce((sum, item) => {
    return sum + calculateItemTotal(item);
  }, 0);

  // 3. 쿠폰 할인 적용
  const finalTotal = applyCouponDiscount(
    totalAfterQuantityDiscount,
    selectedCoupon
  );

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(finalTotal),
    totalDiscount: Math.round(totalBeforeDiscount - finalTotal),
  };
};
