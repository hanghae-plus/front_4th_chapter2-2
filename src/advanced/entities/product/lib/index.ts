import { Discount } from '../model';

export const getMaxDiscount = (discounts: Discount[]) => {
  return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0);
};
