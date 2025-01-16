import { CartItem } from '../../types';

export const getMaxDiscount = (discounts: { quantity: number; rate: number }[]) => {
  return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0);
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  const {
    product: { discounts },
    quantity,
  } = item;

  if (discounts.length === 0) return 0;
  const avaliableDiscount = discounts.filter((discount) => discount.quantity <= quantity);

  return getMaxDiscount(avaliableDiscount);
};
