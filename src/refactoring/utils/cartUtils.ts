import { CartItem, Coupon } from "../../types";

export const getAppliedDiscount = (item: CartItem) => {
  const { discounts } = item.product;
  const { quantity } = item;

  return discounts.reduce(
    (maxDiscount, discount) =>
      quantity >= discount.quantity
        ? Math.max(maxDiscount, discount.rate)
        : maxDiscount,
    0
  );
};
/**
 * 할인 전 총 가격을 계산
 */
export const calculateTotalBeforeDiscount = (cart: CartItem[]): number => {
  return cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
};

/**
 * 개별 상품의 할인 적용 후 총 가격을 계산
 */
export const calculateTotalAfterDiscount = (cart: CartItem[]): number => {
  return cart.reduce((total, item) => {
    const discount = getAppliedDiscount(item);
    return total + item.product.price * item.quantity * (1 - discount);
  }, 0);
};

/**
 * 최종 쿠폰 할인을 적용하여 할인 후 총 가격 계산
 */
export const applyCouponDiscount = (
  totalAfterDiscount: number,
  selectedCoupon: Coupon | null
): number => {
  if (!selectedCoupon) return totalAfterDiscount;

  if (selectedCoupon.discountType === "amount") {
    return Math.max(0, totalAfterDiscount - selectedCoupon.discountValue);
  } else {
    return totalAfterDiscount * (1 - selectedCoupon.discountValue / 100);
  }
};

/**
 * 최종 결제 금액 및 할인 계산
 */
export const calculateTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  const totalBeforeDiscount = calculateTotalBeforeDiscount(cart);
  const totalAfterDiscountWithoutCoupon = calculateTotalAfterDiscount(cart);
  const totalAfterDiscount = applyCouponDiscount(
    totalAfterDiscountWithoutCoupon,
    selectedCoupon
  );

  return {
    totalBeforeDiscount,
    totalAfterDiscount,
    totalDiscount: totalBeforeDiscount - totalAfterDiscount,
  };
};
