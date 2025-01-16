import { CartItem, Coupon } from "../../types";

// 상품의 기본 금액 계산
export const calculateItemPrice = (item: CartItem): number => {
  return item.product.price * item.quantity;
};

// 상품의 수량 할인율 계산
export const calculateQuantityDiscount = (item: CartItem): number => {
  return item.product.discounts.reduce((maxRate, discount) => {
    return item.quantity >= discount.quantity && discount.rate > maxRate
      ? discount.rate
      : maxRate;
  }, 0);
};

// 쿠폰 할인 적용
export const applyCouponDiscount = (
  amount: number,
  coupon: Coupon | null
): number => {
  if (!coupon) return amount;

  if (coupon.discountType === "amount") {
    return Math.max(0, amount - coupon.discountValue);
  }
  return amount * (1 - coupon.discountValue / 100);
};
