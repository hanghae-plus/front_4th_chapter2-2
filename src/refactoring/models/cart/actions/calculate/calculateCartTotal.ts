import { CartItem, Coupon } from "../../types";
import {
  calculateItemPrice,
  calculateQuantityDiscount,
  applyCouponDiscount,
} from "./discounts";

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  // 1. 할인 전 총액 계산
  const totalBeforeDiscount = cart.reduce(
    (sum, item) => sum + calculateItemPrice(item),
    0
  );

  // 2. 수량 할인 적용
  const totalAfterQuantityDiscount = cart.reduce((sum, item) => {
    const itemPrice = calculateItemPrice(item);
    const discountRate = calculateQuantityDiscount(item);
    return sum + itemPrice * (1 - discountRate);
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
