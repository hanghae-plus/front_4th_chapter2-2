import { CartItem, Coupon } from "../../types";

export const calculateItemTotal = (item: CartItem) => {
  const resultPrice = item.product.price * item.quantity;
  const rateArray = item.product.discounts
    .filter((discount) => discount.quantity <= item.quantity)
    .map((discount) => discount.rate);

  if (rateArray.length > 0) {
    const discountRate = Math.max(...rateArray);
    return resultPrice * (1 - discountRate);
  }
  return resultPrice;
  // return 0;
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  const { quantity } = item;
  const discount = item.product.discounts.reduce((maxDiscount, d) => {
    return quantity >= d.quantity && d.rate > maxDiscount
      ? d.rate
      : maxDiscount;
  }, 0);
  return discount;
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  cart.forEach((item) => {
    const { price } = item.product;
    const { quantity } = item;
    totalBeforeDiscount += price * quantity;

    const discount = getMaxApplicableDiscount(item);

    totalAfterDiscount += price * quantity * (1 - discount);
  });

  let totalDiscount = totalBeforeDiscount - totalAfterDiscount;

  // 쿠폰 적용
  if (selectedCoupon) {
    if (selectedCoupon.discountType === "amount") {
      totalAfterDiscount = Math.max(
        0,
        totalAfterDiscount - selectedCoupon.discountValue
      );
    } else {
      totalAfterDiscount *= 1 - selectedCoupon.discountValue / 100;
    }
    totalDiscount = totalBeforeDiscount - totalAfterDiscount;
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
    totalDiscount: Math.round(totalDiscount),
  };
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  const calcCart = cart
    .map((item) => {
      if (item.product.id === productId) {
        const maxQuantity = item.product.stock;
        const updateQuantity = Math.max(0, Math.min(maxQuantity, newQuantity));
        return updateQuantity > 0
          ? { ...item, quantity: updateQuantity }
          : null;
      }
      return item;
    })
    .filter((item): item is CartItem => item !== null);

  return calcCart;
};
