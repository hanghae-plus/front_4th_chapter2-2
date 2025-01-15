import type { CartItem, Coupon, Product } from '../../types';

export const calculateItemTotal = (item: CartItem) => {
  const { product, quantity } = item;

  const discountRate = getMaxApplicableDiscount(item);
  const total = product.price * quantity * (1 - discountRate);

  return total;
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  const { product, quantity } = item;

  if (!product.discounts.length) {
    return 0;
  }

  return product.discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && maxDiscount < discount.rate ? (maxDiscount = discount.rate) : maxDiscount;
  }, 0);
};

const calculateTotalDiscount = (cart: CartItem[]) => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  cart.forEach((item) => {
    const { price } = item.product;
    const { quantity } = item;

    totalBeforeDiscount += price * quantity;

    totalAfterDiscount += calculateItemTotal(item);
  });

  return { totalDiscount: totalBeforeDiscount - totalAfterDiscount, totalBeforeDiscount, totalAfterDiscount };
};

const applyCoupon = (
  totalDiscounts: { totalDiscount: number; totalBeforeDiscount: number; totalAfterDiscount: number },
  coupon: Coupon | null,
) => {
  if (!coupon) return totalDiscounts;

  // eslint-disable-next-line prefer-const
  let { totalDiscount, totalBeforeDiscount, totalAfterDiscount } = totalDiscounts;

  if (coupon.discountType === 'amount') {
    totalAfterDiscount = Math.max(0, totalAfterDiscount - coupon.discountValue);
  } else {
    totalAfterDiscount *= 1 - coupon.discountValue / 100;
  }
  totalDiscount = totalBeforeDiscount - totalAfterDiscount;

  return { totalDiscount, totalBeforeDiscount, totalAfterDiscount };
};

export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null) => {
  const totalDiscounts = calculateTotalDiscount(cart);
  const { totalDiscount, totalBeforeDiscount, totalAfterDiscount } = applyCoupon(totalDiscounts, selectedCoupon);

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
    totalDiscount: Math.round(totalDiscount),
  };
};

export const updateCartItemQuantity = (cart: CartItem[], productId: string, newQuantity: number): CartItem[] => {
  return cart
    .map((item) => {
      const {
        product: { id, stock },
      } = item;

      if (id !== productId) return item;

      const maxQuantity = stock;
      const validQuantity = Math.max(0, Math.min(newQuantity, maxQuantity));

      return validQuantity > 0 ? { ...item, quantity: validQuantity } : null;
    })
    .filter((item) => item !== null);
};

export const getRemainingStock = (product: Product, cart: CartItem[]) => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  return product.stock - (cartItem?.quantity || 0);
};
