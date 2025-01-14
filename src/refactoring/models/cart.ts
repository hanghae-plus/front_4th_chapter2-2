import { CartItem, Coupon, Product } from '../../types';

export const calculateItemTotal = (item: CartItem) => {
  const {
    product: { price },
    quantity,
  } = item;

  const total = price * quantity;
  const discountRate = getMaxApplicableDiscount(item);

  return total * (1 - discountRate);
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  const {
    product: { discounts },
    quantity,
  } = item;

  const discount = discounts.reduce((maxDiscount, d) => {
    return quantity >= d.quantity && d.rate > maxDiscount ? d.rate : maxDiscount;
  }, 0);

  return discount;
};

export const calculateCouponDiscount = (selectedCoupon: Coupon, totalAfterDiscount: number) => {
  if (selectedCoupon.discountType === 'amount') {
    totalAfterDiscount = Math.max(0, totalAfterDiscount - selectedCoupon.discountValue);
  } else {
    totalAfterDiscount *= 1 - selectedCoupon.discountValue / 100;
  }

  return totalAfterDiscount;
};

export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null) => {
  const itemTotals = cart.map((item) => {
    const {
      product: { price },
      quantity,
    } = item;

    return {
      totalBeforeDiscount: price * quantity,
      totalAfterDiscount: calculateItemTotal(item),
    };
  });

  const { totalBeforeDiscount, totalAfterDiscount } = itemTotals.reduce(
    (acc, item) => ({
      totalBeforeDiscount: acc.totalBeforeDiscount + item.totalBeforeDiscount,
      totalAfterDiscount: acc.totalAfterDiscount + item.totalAfterDiscount,
    }),
    { totalBeforeDiscount: 0, totalAfterDiscount: 0 }
  );

  const totalAfterCouponDiscount = selectedCoupon
    ? calculateCouponDiscount(selectedCoupon, totalAfterDiscount)
    : totalAfterDiscount;

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterCouponDiscount),
    totalDiscount: Math.round(totalBeforeDiscount - totalAfterCouponDiscount),
  };
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  return cart
    .map((item) => {
      const {
        product: { id, stock },
      } = item;

      if (id === productId) {
        const maxQuantity = stock;
        const updatedQuantity = Math.max(0, Math.min(newQuantity, maxQuantity));

        return updatedQuantity > 0 ? { ...item, quantity: updatedQuantity } : null;
      }

      return item;
    })
    .filter((item): item is CartItem => item !== null);
};

export const getRemainingStock = (cart: CartItem[], product: Product) => {
  const cartItem = cart.find((item) => item.product.id === product.id);

  return product.stock - (cartItem?.quantity || 0);
};
