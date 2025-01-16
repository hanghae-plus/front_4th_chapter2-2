import { IProduct } from '../../../shared/types';
import { CartItem } from '../../../../types.ts';

export const getRemainingStock = (cart: CartItem[], product: IProduct) => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  return product.stock - (cartItem?.quantity || 0);
};

export const getMaxDiscount = (
  discounts: { quantity: number; rate: number }[],
) => {
  return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0);
};
