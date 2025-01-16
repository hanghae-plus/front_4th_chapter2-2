/**
 * 최대 할인율을 계산하는 함수
 */
export const calculateMaxDiscount = (discounts: { quantity: number; rate: number }[]) =>
  discounts.reduce((max, discount) => Math.max(max, discount.rate), 0);
