import { CartItem, Coupon } from "../../types";

export const getMaxApplicableDiscount = (item: CartItem) => {
  const { product, quantity } = item;
  const targetDiscounts = product.discounts.filter(
    (d) => quantity >= d.quantity
  );

  return targetDiscounts.reduce((max, d) => {
    return quantity >= d.quantity && d.rate > max ? d.rate : max;
  }, 0);
};

export const calculateItemTotal = (item: CartItem) => {
  const { product, quantity } = item;

  const discount = getMaxApplicableDiscount(item);
  return product.price * quantity * (1 - discount);
};


export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null) => {
  const totalBeforeDiscount = cart.reduce((total, item) => {
    const { price } = item.product;
    const { quantity } = item;
    return total + price * quantity;
  }, 0);

  let totalAfterDiscount = cart.reduce((total, item) => {
    const { price } = item.product;
    const { quantity } = item;
    const discount = getMaxApplicableDiscount(item);
    return total + price * quantity * (1 - discount);
  }, 0);

  let totalDiscount = totalBeforeDiscount - totalAfterDiscount;

  // 쿠폰 적용
  if (selectedCoupon != null) {
    if (selectedCoupon.discountType === "amount") {
      totalAfterDiscount = Math.max(
        0,
        totalAfterDiscount - selectedCoupon.discountValue
      );
    } else {
      totalAfterDiscount *= 1 - selectedCoupon.discountValue / 100;
    }

    return {
      totalBeforeDiscount: Math.round(totalBeforeDiscount),
      totalAfterDiscount: Math.round(totalAfterDiscount),
      totalDiscount: Math.round(totalBeforeDiscount - totalAfterDiscount),
    };
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
    totalDiscount: Math.round(totalDiscount),
  };
};

export const updateCartItemQuantity = (cart: CartItem[], productId: string, newQuantity: number) => {
  return cart.map((item) => {
    if (item.product.id === productId) {
        const maxQuantity = item.product.stock;
        const updatedQuantity = Math.max(0, Math.min(newQuantity, maxQuantity));
        return updatedQuantity > 0 ? { ...item, quantity: updatedQuantity } : null;
    }
    return item;
  }).filter((item): item is CartItem => item !== null)
}
