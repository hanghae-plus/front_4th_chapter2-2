import { CartItem, Coupon } from "../types";

// 상품의 기본 금액 계산
const calculateItemPrice = (item: CartItem): number => {
  return item.product.price * item.quantity;
};

// 상품의 수량 할인율 계산
const calculateQuantityDiscount = (item: CartItem): number => {
  return item.product.discounts.reduce((maxRate, discount) => {
    return item.quantity >= discount.quantity && discount.rate > maxRate
      ? discount.rate
      : maxRate;
  }, 0);
};

// 쿠폰 할인 적용
const applyCouponDiscount = (amount: number, coupon: Coupon | null): number => {
  if (!coupon) return amount;

  if (coupon.discountType === "amount") {
    return Math.max(0, amount - coupon.discountValue);
  }
  return amount * (1 - coupon.discountValue / 100);
};

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
