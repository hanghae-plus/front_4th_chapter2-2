import { CartItem, Coupon } from "../../types";

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
): { totalBeforeDiscount: number; totalAfterDiscount: number; totalDiscount: number } => {
  const totalBeforeDiscount = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // 항목별 할인 적용 후의 총 금액
  const totalAfterItemDiscount = cart.reduce(
    (sum, item) => sum + calculateItemTotal(item),
    0
  );

  
  // 쿠폰 할인 적용
  let couponDiscount = 0;

  if (selectedCoupon) {
    if (selectedCoupon.discountType === "percentage") {
      couponDiscount = Math.round(totalAfterItemDiscount * (selectedCoupon.discountValue / 100));
    } else if (selectedCoupon.discountType === "amount") {
      couponDiscount = selectedCoupon.discountValue;
    }
  }

  const totalAfterDiscount = Math.max(totalAfterItemDiscount - couponDiscount, 0);
  const totalDiscount = totalBeforeDiscount - totalAfterDiscount;

  return {
    totalBeforeDiscount,
    totalAfterDiscount,
    totalDiscount,
  };
};

export const calculateItemTotal = (item: CartItem): number => {
  const { price } = item.product;
  const { quantity } = item;
  const maxDiscount = getMaxApplicableDiscount(item);
  
  return Math.round(price * quantity * (1 - maxDiscount));
};

export const getMaxApplicableDiscount = (item: CartItem): number => {
  const { discounts } = item.product;
  const { quantity } = item;
  return discounts.reduce(
    (maxDiscount, discount) =>
      quantity >= discount.quantity ? Math.max(maxDiscount, discount.rate) : maxDiscount,
    0
  );
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  if (newQuantity <= 0) {
    // 새로운 수량이 0 이하이면 해당 항목 제거
    return cart.filter((item) => item.product.id !== productId);
  }

  // 수량이 0 이상인 경우 항목 업데이트
  return cart.map((item) =>
    item.product.id === productId
      ? { ...item, quantity: Math.min(newQuantity, item.product.stock) }
      : item
  );
};