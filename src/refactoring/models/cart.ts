import { CartItem, Coupon } from "../../types";

export const calculateItemTotal = (item: CartItem) => {
  const { product, quantity } = item;
  const { price } = product;
  const maxDiscountRate = getMaxApplicableDiscount(item);

  const total = price * quantity;
  const discountedTotal = total * (1 - maxDiscountRate);
  return discountedTotal;
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  const { product, quantity } = item;
  const { discounts } = product;
  const maxDiscountRate = discounts.reduce((max, discount) => {
    if (discount.quantity <= quantity) {
      return Math.max(max, discount.rate);
    }
    return max;
  }, 0);

  return maxDiscountRate;
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  const totalBeforeDiscount = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const totalAfterDiscount =
    selectedCoupon?.discountType === "amount"
      ? cart.reduce((total, item) => total + calculateItemTotal(item), 0) -
        selectedCoupon.discountValue
      : cart.reduce((total, item) => total + calculateItemTotal(item), 0) *
        (1 - (selectedCoupon?.discountValue || 0) / 100);

  const totalDiscount = totalBeforeDiscount - totalAfterDiscount;

  return {
    totalBeforeDiscount,
    totalAfterDiscount,
    totalDiscount,
  };
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  const updatedCard = cart.map((item) => {
    if (item.product.id === productId) {
      if (newQuantity > item.product.stock) {
        return { ...item, quantity: item.product.stock };
      } else if (newQuantity < 0) {
        return { ...item, quantity: 0 };
      } else {
        return { ...item, quantity: newQuantity };
      }
    }
    return item;
  });
  return updatedCard.filter((item) => item.quantity > 0);
};
