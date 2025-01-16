import { CartItem, Coupon } from "../../types";
import {
  calculateItemPrice,
  calculateQuantityDiscount,
  applyCouponDiscount,
} from "./discounts";

export const calculateItemTotal = (item: CartItem) => {
  const basePrice = item.product.price * item.quantity;
  const discountRate = getMaxApplicableDiscount(item);
  return basePrice * (1 - discountRate);
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  const applicableDiscounts = item.product.discounts
    .filter((discount) => item.quantity >= discount.quantity)
    .map((discount) => discount.rate);

  return applicableDiscounts.length > 0 ? Math.max(...applicableDiscounts) : 0;
};

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
