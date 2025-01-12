import { CartItem, Coupon } from "../../types";

const calculateOriginalTotal = (item: CartItem) => {
  return item.product.price * item.quantity;
};

const calculateCouponDiscount = (totalPrice: number, coupon: Coupon | null) => {
  if (!coupon) return totalPrice;

  if (coupon.discountType === "amount") {
    return Math.max(0, totalPrice - coupon.discountValue);
  } else {
    return totalPrice * (1 - coupon.discountValue / 100);
  }
};

/**
 * 아이템의 총 가격을 계산하는 함수
 * product의 discounts 중 가장 큰 할인을 적용한다.
 */
export const calculateItemTotal = (item: CartItem) => {
  const maxDiscount = getMaxApplicableDiscount(item);
  return item.product.price * item.quantity * (1 - maxDiscount);
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  const maxDiscount = item.product.discounts.reduce((maxDiscount, d) => {
    return item.quantity >= d.quantity && d.rate > maxDiscount
      ? d.rate
      : maxDiscount;
  }, 0);
  return maxDiscount;
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  const totalBeforeDiscount = cart.reduce((total, item) => {
    return total + calculateOriginalTotal(item);
  }, 0);
  const totalAfterProductDiscount = cart.reduce((total, item) => {
    return total + calculateItemTotal(item);
  }, 0);
  const totalAfterDiscount = calculateCouponDiscount(
    totalAfterProductDiscount,
    selectedCoupon
  );

  const totalDiscount = totalBeforeDiscount - totalAfterDiscount;

  return {
    totalBeforeDiscount,
    totalAfterDiscount,
    totalDiscount,
  };
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  if (newQuantity === 0) {
    return cart.filter((item) => item.product.id !== productId);
  }

  const itemIndex = cart.findIndex((item) => item.product.id === productId);
  if (itemIndex === -1) return cart;

  return cart.map((item, index) => {
    if (index !== itemIndex) return item;

    const validQuantity = Math.min(newQuantity, item.product.stock);
    return {
      ...item,
      quantity: validQuantity,
    };
  });
};
