import { CartItem, Coupon } from "../../types";

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null 
) => {
   // 1. 상품 금액 합계 (할인 전)
  const totalBeforeDiscount = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // 2. 상품별 할인 적용 후 합계
  const totalAfterItemDiscount = cart.reduce(
    (sum, item) => sum + calculateItemTotal(item),
    0
  );

  // 쿠폰 할인 적용
  let couponDiscount = 0;

  if (selectedCoupon) {
    // 전체 금액에 대해 한 번만 쿠폰 할인 적용
    if (selectedCoupon.discountType === "percentage") {
      couponDiscount = totalAfterItemDiscount * (selectedCoupon.discountValue / 100);
    } else if (selectedCoupon.discountType === "amount") {
      couponDiscount = Math.min(selectedCoupon.discountValue, totalAfterItemDiscount);
    }
  }

  // 4. 최종 결제 금액
  const totalAfterDiscount = Math.max(0, totalAfterItemDiscount - couponDiscount);

  // 5. 총 할인 금액
  const totalDiscount = totalBeforeDiscount - totalAfterItemDiscount + couponDiscount;

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