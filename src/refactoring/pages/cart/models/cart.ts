import { CartItem } from "../../../../types";

export const calculateItemTotal = (item: CartItem) => {
  const { price } = item.product;
  const { quantity } = item;

  const discount = getMaxApplicableDiscount(item);

  return price * quantity * (1 - discount);
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  const { discounts } = item.product;
  const { quantity } = item;

  return discounts
    .filter((discount) => quantity >= discount.quantity)
    .reduce((maxRate, discount) => Math.max(maxRate, discount.rate), 0);
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  return cart
    .map((item) => {
      if (item.product.id === productId) {
        const maxQuantity = item.product.stock;
        const updatedQuantity = Math.max(0, Math.min(newQuantity, maxQuantity));
        return updatedQuantity > 0
          ? { ...item, quantity: updatedQuantity }
          : null;
      }
      return item;
    })
    .filter((item): item is CartItem => item !== null);
};
