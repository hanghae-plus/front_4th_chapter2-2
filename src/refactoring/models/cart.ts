import { CartItem, Coupon } from "../../types";

export const calculateItemTotal = (item: CartItem): number => {
  const { price, discounts } = item.product;
  const { quantity } = item;
  const maxDiscount = getMaxApplicableDiscount(discounts, quantity);
  
  return price * quantity * (1 - maxDiscount);
};

export const getMaxApplicableDiscount = (
  discounts: { quantity: number; rate: number }[],
  quantity: number
): number => {  
  return discounts.reduce(
    (max, discount) =>
      quantity >= discount.quantity ? Math.max(max, discount.rate) : max,
    0
  );
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  const totalBeforeDiscount = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const totalAfterDiscount = cart.reduce(
    (total, item) => total + calculateItemTotal(item),
    0
  );

  let totalDiscount = totalBeforeDiscount - totalAfterDiscount;

  // 쿠폰이 있을 경우, 쿠폰 타입에 맞게 할인 적용
  if (!selectedCoupon) return { totalBeforeDiscount, totalAfterDiscount, totalDiscount };

  if (selectedCoupon.discountType === 'amount') {
    // amount 방식: discountValue는 금액
    totalDiscount += selectedCoupon.discountValue;
    return { totalBeforeDiscount, totalAfterDiscount, totalDiscount };
  }

  if (selectedCoupon.discountType === 'percentage') {
    // percentage 방식: discountValue는 백분율 (예: 10은 10% 할인)
    totalDiscount += totalBeforeDiscount * (selectedCoupon.discountValue / 100);
    return { totalBeforeDiscount, totalAfterDiscount, totalDiscount };
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
  newQuantity: number
): CartItem[] => {
  // 새로운 수량이 0보다 작으면 해당 아이템 삭제
  if (newQuantity <= 0) return cart.filter((item) => item.product.id !== productId);

  return cart.map((item) => 
    item.product.id === productId
      ? { ...item, quantity: Math.min(newQuantity, item.product.stock) }
      : item
  );
};
