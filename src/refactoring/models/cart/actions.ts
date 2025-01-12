import { validateProductQuantity } from "../product/helpers";
import { validateCartItemQuantity } from "./helpers";
import { CartItem } from "./types";

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  return cart
    .map((item) => {
      if (item.product.id === productId) {
        const validatedItem = validateCartItemQuantity(item, newQuantity);
        return validatedItem;
      } else {
        return item;
      }
    })
    .filter((item): item is CartItem => item !== null);
};
