import { CartItem, Coupon } from "../../types";

export const calculateItemTotal = (item: CartItem): number => {
  const { product, quantity } = item;

  const maxDiscountRate = getMaxApplicableDiscount(item);

  const discountedPrice = product.price * (1 - maxDiscountRate);

  return discountedPrice * quantity;
};

export const getMaxApplicableDiscount = (item: CartItem): number => {
  const { product, quantity } = item;

  // 현재 수량에 적용 가능한 최대 할인율 계산
  return product.discounts
    .filter((discount) => quantity >= discount.quantity)
    .reduce((maxRate, discount) => Math.max(maxRate, discount.rate), 0);
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null,
): {
  totalBeforeDiscount: number;
  totalDiscount: number;
  totalAfterDiscount: number;
} => {
  const totalBeforeDiscount = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );
  let totalAfterDiscount = cart.reduce((total, item) => {
    return total + calculateItemTotal(item);
  }, 0);
  let totalDiscount = totalBeforeDiscount - totalAfterDiscount;

  // 쿠폰 적용
  if (selectedCoupon) {
    if (selectedCoupon.discountType === "amount") {
      totalAfterDiscount -= selectedCoupon.discountValue;
      totalDiscount += selectedCoupon.discountValue;
    } else {
      const discountRate = selectedCoupon.discountValue / 100;
      totalAfterDiscount *= 1 - discountRate;
      totalDiscount = totalBeforeDiscount - totalAfterDiscount;
    }
  }

  return {
    totalBeforeDiscount,
    totalAfterDiscount,
    totalDiscount,
  };
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number,
): CartItem[] => {
  return cart
    .map((item) => {
      if (item.product.id === productId) {
        if (newQuantity <= 0) {
          return null;
        }

        const adjustedQuantity = Math.min(newQuantity, item.product.stock);
        return { ...item, quantity: adjustedQuantity };
      }
      return item;
    })
    .filter((item) => item !== null) as CartItem[];
};
