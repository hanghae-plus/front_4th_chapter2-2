import { CartItem, Coupon } from "../../types";

export const calculateItemTotal = (item: CartItem) => {
  const { product, quantity } = item;
  const baseTotal = calculateBaseTotal(product.price, quantity);
  const maxDiscountRate = getMaxDiscountRate(product.discounts, quantity);
  const finalTotal = applyDiscount(baseTotal, maxDiscountRate);

  return Math.round(finalTotal);
};

const calculateBaseTotal = (price: number, quantity: number): number => {
  return price * quantity;
};

const getMaxDiscountRate = (
  discounts: { quantity: number; rate: number }[],
  quantity: number
): number => {
  return discounts.reduce((maxRate, discount) => {
    if (!isDiscountApplicable(discount, quantity)) {
      return maxRate;
    }
    return Math.max(maxRate, discount.rate);
  }, 0);
};

const isDiscountApplicable = (
  discount: { quantity: number; rate: number },
  quantity: number
): boolean => {
  return quantity >= discount.quantity;
};

const applyDiscount = (amount: number, discountRate: number): number => {
  return amount * (1 - discountRate);
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  const { product, quantity } = item;
  return getMaxDiscountRate(product.discounts, quantity);
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  const totalBeforeDiscount = calculateTotalBeforeDiscount(cart);
  const totalAfterItemDiscounts = calculateTotalAfterItemDiscounts(cart);
  const totalAfterCoupon = applyCouponDiscount(
    totalAfterItemDiscounts,
    selectedCoupon
  );

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterCoupon),
    totalDiscount: Math.round(totalBeforeDiscount - totalAfterCoupon),
  };
};

const calculateTotalBeforeDiscount = (cart: CartItem[]): number => {
  return cart.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);
};

const calculateTotalAfterItemDiscounts = (cart: CartItem[]): number => {
  return cart.reduce((total, item) => {
    return total + calculateItemTotal(item);
  }, 0);
};

const applyCouponDiscount = (amount: number, coupon: Coupon | null): number => {
  if (!coupon) return amount;

  if (coupon.discountType === "amount") {
    return Math.max(0, amount - coupon.discountValue);
  }

  return amount * (1 - coupon.discountValue / 100);
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  return cart
    .map((item) => {
      if (item.product.id !== productId) return item;

      if (newQuantity <= 0) return null;

      const updatedQuantity = Math.min(newQuantity, item.product.stock);
      return { ...item, quantity: updatedQuantity };
    })
    .filter((item): item is CartItem => item !== null);
};
