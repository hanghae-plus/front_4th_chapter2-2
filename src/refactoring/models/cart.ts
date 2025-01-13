import { CartItem } from "../../types";

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




