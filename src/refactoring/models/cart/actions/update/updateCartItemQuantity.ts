import { CartItem } from "../../types";
import { updateItem } from "./updateUtils";
import { validateQuantity } from "./validate";

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  return cart
    .map((item) =>
      item.product.id === productId
        ? updateItem(item, validateQuantity(newQuantity, item.product.stock))
        : item
    )
    .filter((item): item is CartItem => item !== null);
};
