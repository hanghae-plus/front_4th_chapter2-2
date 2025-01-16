import { CartItem } from '@/shared/types';

export const getAppliedDiscount = (item: CartItem) => {
  const { discounts } = item.product;
  const { quantity } = item;
  let appliedDiscount = 0;
  for (const discount of discounts) {
    if (quantity >= discount.quantity) {
      appliedDiscount = Math.max(appliedDiscount, discount.rate);
    }
  }
  return appliedDiscount;
};

// 이미 있는 getAppliedDiscount를 수정하지 않고 재사용하기 위함
export const getMaxApplicableDiscount = (item: CartItem) => {
  return getAppliedDiscount(item);
};

export const getMaxDiscount = (discounts: { quantity: number; rate: number }[]) => {
  return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0);
};
