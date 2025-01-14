import type { CartItem, Coupon } from '@/types';

const calculateItemSubTotal = (item: CartItem) => {
  const { price } = item.product;
  const { quantity } = item;

  return price * quantity;
};

export const calculateItemTotal = (item: CartItem) => {
  const itemSubTotal = calculateItemSubTotal(item);
  const discount = getMaxApplicableDiscount(item);

  return itemSubTotal * (1 - discount);
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  const { discounts } = item.product;
  const appliedDiscount = discounts.reduce((maxDiscount, discount) => {
    return item.quantity >= discount.quantity ? Math.max(maxDiscount, discount.rate) : maxDiscount;
  }, 0);

  return appliedDiscount;
};

export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null) => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  cart.forEach(item => {
    totalBeforeDiscount += calculateItemSubTotal(item);
    totalAfterDiscount += calculateItemTotal(item);
  });

  let totalDiscount = totalBeforeDiscount - totalAfterDiscount;

  // 쿠폰 적용
  if (selectedCoupon) {
    if (selectedCoupon.discountType === 'amount') {
      totalAfterDiscount = Math.max(0, totalAfterDiscount - selectedCoupon.discountValue);
    } else {
      totalAfterDiscount *= 1 - selectedCoupon.discountValue / 100;
    }
    totalDiscount = totalBeforeDiscount - totalAfterDiscount;
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
    totalDiscount: Math.round(totalDiscount)
  };
};

export const updateCartItemQuantity = (cart: CartItem[], productId: string, newQuantity: number): CartItem[] => {
  return cart
    .filter(item => {
      if (item.product.id === productId) {
        const maxQuantity = item.product.stock;
        const updatedQuantity = Math.max(0, Math.min(newQuantity, maxQuantity));
        return updatedQuantity > 0;
      }
      return true;
    })
    .map(item => {
      if (item.product.id === productId) {
        return { ...item, quantity: Math.max(0, Math.min(newQuantity, item.product.stock)) };
      }
      return item;
    });
};
