// useCart.ts
import { useState } from 'react';
import { CartItem, Coupon, Product } from '../../types';
import { applyCouponDiscount, calculateAddToCart, calculateCartTotal, updateCartItemQuantity } from '../models/cart';
import { useLocalStorage } from './useLocalStorage';

// 2. 장바구니 내역 나타내기
export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const [storedItem, setCartItem, removeCartItem] = useLocalStorage('cart-item', '');

  // 2-1. 장바구니 내역에 상품 담기
  const addToCart = (product: Product) => {
    setCart((prevCart) => calculateAddToCart(prevCart, product));
    setCartItem(product);
  };

  // 2-2. 장바구니 내역에 상품 삭제하기
  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
    removeCartItem();
  };

  // 2-3. 장바구니 내역에 상품 업데이트하기
  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((prevCart) => updateCartItemQuantity(prevCart, productId, newQuantity));
  };

  // 2-4. 쿠폰 선택하기
  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

  // 2-5. 장바구니 내 모든 상품 총액 계산하기
  const calculateTotal = () => {
    const {totalBeforeDiscount, totalAfterDiscount: initialTotalAfterDiscount} = calculateCartTotal(cart);

    const {totalAfterDiscount, totalDiscount} = applyCouponDiscount(initialTotalAfterDiscount, totalBeforeDiscount, selectedCoupon);

    return {
      totalBeforeDiscount, totalAfterDiscount, totalDiscount: Math.round(totalDiscount)
    }
  };

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
