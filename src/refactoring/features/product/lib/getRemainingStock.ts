import { CartItem, Product } from '../../../../types';
import { findCartItem } from '../../../entities/cart/lib';

export const getRemainingStock = (cart: CartItem[], product: Product) => {
  const cartItem = findCartItem(cart, product.id);
  return product.stock - (cartItem?.quantity || 0);
};
