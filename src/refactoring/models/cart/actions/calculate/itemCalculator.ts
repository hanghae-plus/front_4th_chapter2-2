import { CartItem } from "../../types";

export const calculateItemTotal = (item: CartItem) => {
  const basePrice = item.product.price * item.quantity;
  const discountRate = getMaxApplicableDiscount(item);
  return basePrice * (1 - discountRate);
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  const applicableDiscounts = item.product.discounts
    .filter((discount) => item.quantity >= discount.quantity)
    .map((discount) => discount.rate);

  return applicableDiscounts.length > 0 ? Math.max(...applicableDiscounts) : 0;
};
