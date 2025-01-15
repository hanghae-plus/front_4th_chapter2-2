import { useState } from 'react';
import { CartItem, Coupon, Product } from '../../types';
import {
  calculateRemainingStock,
  calculateCartTotal,
  updateCartItemQuantity,
} from '../models/cart';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // 장바구니 항목 추가
  const addToCart = (product: Product) => {
    const remainingStock = calculateRemainingStock(cart, product);
    if (remainingStock <= 0) return;

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

  // 장바구니 항목 제거
  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  // 쿠폰 적용
  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity: (productId: string, newQuantity: number) => {
      // 수량 업데이트
      setCart((cart) => updateCartItemQuantity(cart, productId, newQuantity));
    },
    applyCoupon,
    calculateTotal: () => {
      // 총합 계산 함수
      return calculateCartTotal(cart, selectedCoupon);
    },
    selectedCoupon,
  };
};
