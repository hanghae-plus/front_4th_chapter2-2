import { useState } from 'react';
import { CartItem, Coupon, Product } from '../../types';
import { calculateCartTotal, updateCartItemQuantity } from '../models/cart';

/**
 * 장바구니 관련 로직을 처리하는 커스텀 훅
 */
export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // 카트에 상품 추가
  const addToCart = (product: Product) => {
    setCart((prevCart) => addOrUpdateProductInCart(prevCart, product));
  };

  // 카트에서 상품 제거
  const removeFromCart = (productId: string) => {
    setCart((prevCart) => removeProductFromCart(prevCart, productId));
  };

  // 카트 상품 수량 업데이트
  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((prevCart) => updateCartItemQuantity(prevCart, productId, newQuantity));
  };

  // 쿠폰 적용
  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

  // 카트 총합 계산
  const calculateTotal = () =>
    cart.length ? calculateCartTotal(cart, selectedCoupon) : getDefaultCartTotal();

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    selectedCoupon,
  };
};

/**
 * 상품 추가 또는 수량 업데이트
 */
const addOrUpdateProductInCart = (cart: CartItem[], product: Product): CartItem[] => {
  const existingItem = cart.find((item) => item.product.id === product.id);
  return existingItem
    ? updateCartItemQuantity(cart, product.id, existingItem.quantity + 1)
    : [...cart, { product, quantity: 1 }];
};

/**
 * 상품 제거
 */
const removeProductFromCart = (cart: CartItem[], productId: string): CartItem[] =>
  cart.filter((item) => item.product.id !== productId);

/**
 * 기본 카트 총합 반환
 */
const getDefaultCartTotal = () => ({
  totalBeforeDiscount: 0,
  totalAfterDiscount: 0,
  totalDiscount: 0,
});
