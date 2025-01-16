import { CartItem, Discount } from '../../../shared/types/types';

const isDiscountApplicable = (quantity: number, discount: Discount) => {
  return quantity >= discount.quantity;
};

const calculateMaxDiscount = (discounts: Discount[], quantity: number) => {
  return discounts.reduce((maxDiscount, discount) => {
    return isDiscountApplicable(quantity, discount) ? Math.max(maxDiscount, discount.rate) : maxDiscount;
  }, 0);
};

export const getAppliedDiscount = (item: CartItem) => {
  return calculateMaxDiscount(item.product.discounts, item.quantity);
};
