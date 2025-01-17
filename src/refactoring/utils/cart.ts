import { CartItem, Product } from '../../types';

export const getRemainingStock = (product: Product, cartList: CartItem[]) => {
  const cartItem = cartList.find((item) => item.product.id === product.id);
  return product.stock - (cartItem?.quantity || 0);
};

export const getAppliedDiscount = (item: CartItem) => {
  const { discounts } = item.product;
  const { quantity } = item;

  let appliedDiscount = 0;

  for (const discount of discounts) {
    if (quantity >= discount.quantity) {
      appliedDiscount = Math.max(appliedDiscount, discount.rate);
    }
  }
  return appliedDiscount;
};

export const getMaxDiscount = (discounts: { quantity: number; rate: number }[]) =>
  discounts.reduce((max, discount) => Math.max(max, discount.rate), 0);
