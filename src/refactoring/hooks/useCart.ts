import { useState } from 'react';
import { CartItem, Coupon, Product } from '../../types';
import { calculateCartTotal, updateCartItemQuantity } from '../models/cart';

/**
 * 장바구니 관련 상태 및 기능을 관리하는 커스텀 훅.
 *
 * @returns {Object}
 * @returns {CartItem[]} cart - 장바구니에 담긴 상품 목록
 * @returns {function} addToCart - 장바구니에 상품을 추가하는 함수
 * @returns {function} removeFromCart - 장바구니에서 상품을 제거하는 함수
 * @returns {function} updateQuantity - 장바구니 아이템의 수량을 업데이트하는 함수
 * @returns {function} applyCoupon - 쿠폰을 장바구니에 적용하는 함수
 * @returns {function} calculateTotal - 장바구니 총액을 계산하는 함수
 * @returns {Coupon | null} selectedCoupon - 적용된 쿠폰
 */
export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // 장바구니에 상품 추가
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);

      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item,
        );
      }

      return [...prevCart, { product, quantity: 1 }];
    });
  };

  // 장바구니에서 상품 제거
  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  // 장바구니 아이템 수량 업데이트
  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((prevCart) => updateCartItemQuantity(prevCart, productId, newQuantity));
  };

  // 쿠폰 적용
  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

  // 총액 계산
  const calculateTotal = () => calculateCartTotal(cart, selectedCoupon);

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
