import { CartItem, Coupon } from "../../types";

export const calculateItemTotal = (item: CartItem) => {
  const { product, quantity } = item;
  const { price } = product;

  const total = price * quantity;
  const discountRate = getMaxApplicableDiscount(item);

  return total * (1 - discountRate);
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  const { product, quantity } = item;
  const { discounts } = product;

  return discounts.reduce((maxDiscount, d) => {
    return quantity >= d.quantity && d.rate > maxDiscount
      ? d.rate
      : maxDiscount;
  }, 0);
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null,
) => {
  const itemTotals = cart.map((item) => {
    const { product, quantity } = item;
    const { price } = product;

    return {
      totalBeforeDiscount: price * quantity,
      totalAfterDiscount: calculateItemTotal(item),
    };
  });

  let { totalBeforeDiscount, totalAfterDiscount } = itemTotals.reduce(
    (acc, item) => ({
      totalBeforeDiscount: acc.totalBeforeDiscount + item.totalBeforeDiscount,
      totalAfterDiscount: acc.totalAfterDiscount + item.totalAfterDiscount,
    }),
    { totalBeforeDiscount: 0, totalAfterDiscount: 0 },
  );

  if (selectedCoupon) {
    if (selectedCoupon.discountType === "amount") {
      totalAfterDiscount = Math.max(
        0,
        totalAfterDiscount - selectedCoupon.discountValue,
      );
    } else {
      totalAfterDiscount *= 1 - selectedCoupon.discountValue / 100;
    }
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
    totalDiscount: Math.round(totalBeforeDiscount - totalAfterDiscount),
  };
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number,
): CartItem[] => {
  return cart
    .map((item) => {
      const { product } = item;
      const { stock, id } = product;

      if (id === productId) {
        const maxQuantity = stock;
        const updatedQuantity = Math.max(0, Math.min(newQuantity, maxQuantity));

        return updatedQuantity > 0
          ? { ...item, quantity: updatedQuantity }
          : null;
      }
      return item;
    })
    .filter((item): item is CartItem => item !== null);
};
