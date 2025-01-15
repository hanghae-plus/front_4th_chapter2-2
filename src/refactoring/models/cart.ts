import { CartItem, Coupon } from "../../types";

export const calculateItemTotal = (item: CartItem) => {
  /**
   * 할인 없이 총액을 계산해야 합니다
   * 수량에 따라 올바른 할인을 적용해야 합니다
   */

  return 0;
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  /** 
   * 할인이 적용되지 않으면 0을 반환해야 합니다 (완)
   * 적용 가능한 가장 높은 할인율을 반환해야 합니다
  */

  return 0;
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  /**
   * 폰 없이 총액을 올바르게 계산해야 합니다
   * 금액쿠폰을 올바르게 적용해야 합니다
   * 퍼센트 쿠폰을 올바르게 적용해야 합니다
   */

  return {
    totalBeforeDiscount: 0,
    totalAfterDiscount: 0,
    totalDiscount: 0
  };
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  /**
   * 수량을 올바르게 업데이트해야 합니다
   * 수량이 0으로 설정된 경우 항목을 제거해야 합니다
   * 재고 한도를 초과해서는 안 됩니다
   */

  return [];
};