import { CartItem, Product } from '../../types';
import { updateCartItemQuantity } from '../models/cart';

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

/**
 * 상품 추가 또는 수량 업데이트
 */
export const addOrUpdateProductInCart = (cart: CartItem[], product: Product): CartItem[] => {
  const existingItem = cart.find((item) => item.product.id === product.id);
  return existingItem
    ? updateCartItemQuantity(cart, product.id, existingItem.quantity + 1)
    : [...cart, { product, quantity: 1 }];
};

/**
 * 상품 제거
 */
export const removeProductFromCart = (cart: CartItem[], productId: string): CartItem[] =>
  cart.filter((item) => item.product.id !== productId);

/**
 * 기본 카트 총합 반환
 */
export const getDefaultCartTotal = () => ({
  totalBeforeDiscount: 0,
  totalAfterDiscount: 0,
  totalDiscount: 0,
});
