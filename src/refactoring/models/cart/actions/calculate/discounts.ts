import { CartItem, Coupon } from "../../types";

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

export const getMaxApplicableDiscount = (item: CartItem) => {
  const applicableDiscounts = item.product.discounts
    .filter((discount) => item.quantity >= discount.quantity)
    .map((discount) => discount.rate);

  return applicableDiscounts.length > 0 ? Math.max(...applicableDiscounts) : 0;
};
