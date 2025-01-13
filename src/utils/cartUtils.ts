import { CartItem, Product } from '../types';

/**
 * 최대 할인율을 계산하는 함수
 */
export const calculateMaxDiscount = (discounts: { quantity: number; rate: number }[]) =>
  discounts.reduce((max, discount) => Math.max(max, discount.rate), 0);

/**
 * 재고를 계산하는 함수
 */
export const calculateRemainingStock = (product: Product, cart: CartItem[]) => {
  const cartItem = cart.find((item) => item.product.id === product.id);

  return product.stock - (cartItem?.quantity || 0);
};

/**
 * 적용할 할인율을 계산하는 함수
 */
export const calculateAppliedDiscount = (item: CartItem) =>
  calculateMaxDiscount(
    item.product.discounts.filter((discount) => item.quantity >= discount.quantity),
  );
