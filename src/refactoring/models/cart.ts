import { CartItem, Coupon } from '../../types';

export const calculateItemTotal = (item: CartItem): number => {
  const baseTotal = item.product.price * item.quantity;
  const discount = getMaxApplicableDiscount(item);
  return baseTotal * (1 - discount);
};

/**
 * 장바구니 아이템에 적용 가능한 최대 할인율을 계산합니다.
 *
 * @description
 * 상품의 수량별 할인 정책에 따라 적용 가능한 최대 할인율을 계산합니다.
 * - 할인 정책이 없는 경우 0을 반환
 * - 구매 수량이 할인 기준 수량을 충족하는 할인들을 찾음
 * - 적용 가능한 할인들 중 가장 높은 할인율을 반환
 *
 * @param item - 할인율을 계산할 장바구니 아이템
 * @returns 적용 가능한 최대 할인율 (0~1 사이의 값)
 */
export const getMaxApplicableDiscount = (item: CartItem): number => {
  if (!item.product.discounts || item.product.discounts.length === 0) {
    return 0;
  }

  const applicableDiscounts = item.product.discounts.filter((discount) => item.quantity >= discount.quantity);

  if (applicableDiscounts.length === 0) {
    return 0;
  }

  return Math.max(...applicableDiscounts.map((discount) => discount.rate));
};

/**
 * 장바구니의 총액을 계산하고 할인을 적용합니다.
 *
 * @description
 * 다음 순서로 장바구니 총액을 계산합니다:
 * 1. 순수 총액 계산 (할인 적용 전)
 * 2. 상품별 수량 할인 적용
 * 3. 쿠폰 할인 적용 (쿠폰이 있는 경우)
 *
 *
 * @param cart - 계산할 장바구니 아이템 목록
 * @param coupon - 적용할 쿠폰 (옵션)
 * @returns 할인 적용 전/후 금액과 할인 금액을 포함한 계산 결과
 */
export const calculateCartTotal = (cart: CartItem[], coupon?: Coupon) => {
  const totalBeforeDiscount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const totalAfterDiscount = cart.reduce((sum, item) => sum + calculateItemTotal(item), 0);

  const itemDiscounts = totalBeforeDiscount - totalAfterDiscount;

  if (!coupon) {
    return {
      totalBeforeDiscount,
      totalDiscount: itemDiscounts,
      totalAfterDiscount,
    };
  }

  let couponDiscount = 0;
  if (coupon.discountType === 'amount') {
    couponDiscount = Math.min(coupon.discountValue, totalAfterDiscount);
  } else {
    couponDiscount = totalAfterDiscount * (coupon.discountValue / 100);
  }

  return {
    totalBeforeDiscount,
    totalDiscount: itemDiscounts + couponDiscount,
    totalAfterDiscount: totalAfterDiscount - couponDiscount,
  };
};

export const updateCartItemQuantity = (cart: CartItem[], productId: string, newQuantity: number): CartItem[] => {
  return [];
};
