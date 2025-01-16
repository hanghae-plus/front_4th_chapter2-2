import { CartItem, Coupon, Product } from '../../types';

export const getMaxDiscount = (
  discounts: { quantity: number; rate: number }[],
  filterFn?: (discount: { quantity: number; rate: number }) => boolean,
) => {
  const filteredDiscounts = filterFn ? discounts.filter(filterFn) : discounts;
  return filteredDiscounts.reduce((max, discount) => Math.max(max, discount.rate), 0);
};

export const getRemainingStock = (product: Product, cart: CartItem[]) => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  return product.stock - (cartItem?.quantity || 0);
};

export const calculateItemDiscount = (item: CartItem) => {
  return getMaxDiscount(item.product.discounts, (discount) => discount.quantity <= item.quantity);
};

export const calculateTotalDiscount = (items: CartItem[]) => {
  return items.reduce((total, item) => {
    const discount = calculateItemDiscount(item);
    return total + item.product.price * item.quantity * discount;
  }, 0);
};

export const calculateCouponDiscount = (
  totalAfterQuantityDiscount: number,
  selectedCoupon: Coupon | null,
): number => {
  if (!selectedCoupon) return 0;

  return Math.min(
    selectedCoupon.discountType === 'percentage'
      ? (selectedCoupon.discountValue / 100) * totalAfterQuantityDiscount
      : selectedCoupon.discountValue,
    totalAfterQuantityDiscount,
  );
};
