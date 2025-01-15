import { CartItem, Coupon } from "../../types";

export const calculateItemTotal = (item: CartItem) => {
  const { product, quantity } = item;
  const discountRate = product.discounts.reduce((max, discount) => {
    return quantity >= discount.quantity ? Math.max(max, discount.rate) : max;
  }, 0);
  return product.price * quantity * (1 - discountRate);
};

export const calculateTotalBeforeDiscount = (cart: CartItem[]) => {
  return cart.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);
};

export const calculateTotalAfterDiscount = (cart: CartItem[]) => {
  return cart.reduce((total, item) => {
    return total + calculateItemTotal(item);
  }, 0);
};

export const applyCoupon = (
  totalAfterDiscount: number,
  selectedCoupon: Coupon | null
) => {
  if (!selectedCoupon) return totalAfterDiscount;

  if (selectedCoupon.discountType === "amount") {
    return Math.max(0, totalAfterDiscount - selectedCoupon.discountValue);
  } else if (selectedCoupon.discountType === "percentage") {
    return totalAfterDiscount * (1 - selectedCoupon.discountValue / 100);
  }

  return totalAfterDiscount;
};

export const calculateTotalDiscount = (
  totalBeforeDiscount: number,
  totalAfterDiscount: number
) => {
  return totalBeforeDiscount - totalAfterDiscount;
};

export const useDiscountCalculator = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  const cartTotals = () => {
    const totalBeforeDiscount = calculateTotalBeforeDiscount(cart);
    const totalAfterDiscountWithoutCoupon = calculateTotalAfterDiscount(cart);
    const totalAfterDiscount = applyCoupon(
      totalAfterDiscountWithoutCoupon,
      selectedCoupon
    );
    const totalDiscount = calculateTotalDiscount(
      totalBeforeDiscount,
      totalAfterDiscount
    );

    return {
      totalBeforeDiscount: Math.round(totalBeforeDiscount),
      totalAfterDiscount: Math.round(totalAfterDiscount),
      totalDiscount: Math.round(totalDiscount),
    };
  };

  return cartTotals;
};
