import { CartItem, Coupon } from '../../types';

export const calculateItemTotal = (item: CartItem) => {
  return item.product.price * item.quantity;
};

export const getMaxApplicableDiscount = (item: CartItem): number => {
  if (!item.product.discounts || item.product.discounts.length === 0) {
    return 0;
  }

  const applicableDiscounts = item.product.discounts.filter((discount) => item.quantity >= discount.quantity);

  if (applicableDiscounts.length === 0) {
    return 0;
  }

  return Math.max(...applicableDiscounts.map((discount) => discount.rate));
};

export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null) => {
  return {
    totalBeforeDiscount: 0,
    totalAfterDiscount: 0,
    totalDiscount: 0,
  };
};

export const updateCartItemQuantity = (cart: CartItem[], productId: string, newQuantity: number): CartItem[] => {
  return [];
};
