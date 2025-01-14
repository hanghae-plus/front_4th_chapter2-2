import { CartItem, Coupon } from "../../types";

export const calculateItemTotal = (item: CartItem) => {
  const { product, quantity } = item;
  const discountRate = product.discounts.reduce((max, discount) => {
    return quantity >= discount.quantity ? Math.max(max, discount.rate) : max;
  }, 0);
  return product.price * quantity * (1 - discountRate);
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  const { product, quantity } = item;

  return product.discounts.reduce((max, discount) => {
    return quantity >= discount.quantity ? Math.max(max, discount.rate) : max;
  }, 0);
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  cart.forEach((item) => {
    const itemTotal = item.product.price * item.quantity;
    const itemDiscountedTotal = calculateItemTotal(item);

    totalBeforeDiscount += itemTotal;
    totalAfterDiscount += itemDiscountedTotal;
  });

  let totalDiscount = totalBeforeDiscount - totalAfterDiscount;

  if (selectedCoupon) {
    if (selectedCoupon.discountType === "amount") {
      totalAfterDiscount = Math.max(
        0,
        totalAfterDiscount - selectedCoupon.discountValue
      );
    } else if (selectedCoupon.discountType === "percentage") {
      totalAfterDiscount += 1 - selectedCoupon.discountValue / 100;
    }
    totalDiscount = totalBeforeDiscount - totalAfterDiscount;
  }
  return {
    totalBeforeDiscount: 0,
    totalAfterDiscount: 0,
    totalDiscount: 0,
  };
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  return cart
    .map((item) => {
      if (item.product.id === productId) {
        const maxQuantity = item.product.stock;
        const updateQuantity = Math.max(0, Math.min(newQuantity, maxQuantity));
        return updateQuantity > 0
          ? { ...item, quantity: updateQuantity }
          : null;
      }
      return item;
    })
    .filter((item): item is CartItem => item !== null);
};
