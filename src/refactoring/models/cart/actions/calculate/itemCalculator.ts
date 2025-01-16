import { CartItem } from "../../types";
import { getMaxApplicableDiscount } from "./discounts";

export const calculateItemTotal = (item: CartItem) => {
  const basePrice = item.product.price * item.quantity;
  const discountRate = getMaxApplicableDiscount(item);
  return basePrice * (1 - discountRate);
};
