import { CartItem, Coupon, Product } from '../../types';

export const getMaxApplicableDiscount = (item: CartItem) => {
  return item.product.discounts
    .filter((discount) => item.quantity >= discount.quantity)
    .map((discount) => discount.rate)
    .reduce((max, rate) => Math.max(max, rate), 0);
};

export const calculateItemTotal = (item: CartItem) => {
  const total = item.product.price * item.quantity;

  return total * (1 - getMaxApplicableDiscount(item));
};

const applyCouponDiscount = (total: number, coupon: Coupon | null): number => {
  if (!coupon) {
    return total;
  }

  return coupon.discountType === 'amount'
    ? Math.max(0, total - coupon.discountValue)
    : total * (1 - coupon.discountValue / 100);
};

export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null) => {
  const totalBeforeDiscount = cart.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0,
  );
  const totalAfterDiscount = cart.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  const finalTotal = applyCouponDiscount(totalAfterDiscount, selectedCoupon);

  return {
    totalBeforeDiscount,
    totalAfterDiscount: finalTotal,
    totalDiscount: totalBeforeDiscount - finalTotal,
  };
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number,
): CartItem[] => {
  if (newQuantity <= 0) {
    return cart.filter((item) => item.product.id !== productId);
  }
  return cart.map((item) =>
    item.product.id === productId
      ? {
          ...item,
          quantity: Math.min(newQuantity, item.product.stock),
        }
      : item,
  );
};

export const findExistingItem = (cart: CartItem[], product: Product): CartItem | undefined => {
  return cart.find((item) => item.product.id === product.id);
};
