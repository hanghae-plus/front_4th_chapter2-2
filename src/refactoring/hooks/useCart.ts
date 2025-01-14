import { useState } from 'react';
import { CartItem, Coupon, Product } from '../../types';
import { calculateCartTotal, updateCartItemQuantity } from '../models/cart';
import {
  addOrUpdateProductInCart,
  getDefaultCartTotal,
  removeProductFromCart,
} from '../utils/cartUtils';

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
