import { CartItem } from '../../../../types';

export const findCartItem = (cart: CartItem[], targetId: string) => {
  return cart.find((item) => item.product.id === targetId);
};
