// useCart.ts
import { useState } from 'react';
import { CartItem, Coupon, Product } from '../../types';
import { calculateAddToCart, calculateCartTotal, updateCartItemQuantity } from '../models/cart';
import { useLocalStorage } from './useLocalStorage';

// 2. 장바구니 내역 나타내기
export const useCart = () => {
  // const [cart, setCart] = useState<CartItem[]>([]);
  const { storedItem: cart, setCartItem } = useLocalStorage<CartItem[]>('cart-item', []);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // 2-1. 장바구니 내역에 상품 담기
  const addToCart = (product: Product) => {
    // setCart((prevCart) => calculateAddToCart(prevCart, product));
    const updatedCart = calculateAddToCart(cart, product);
    setCartItem(updatedCart);
  };

  // 2-2. 장바구니 내역에 상품 삭제하기
  const removeFromCart = (productId: string) => {
    // setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
    const updatedCart = cart.filter((item) => item.product.id !== productId);
    setCartItem(updatedCart);
  };

  // 2-3. 장바구니 내역에 상품 업데이트하기
  const updateQuantity = (productId: string, newQuantity: number) => {
    // setCart((prevCart) => updateCartItemQuantity(prevCart, productId, newQuantity));
    const updatedCart = updateCartItemQuantity(cart, productId, newQuantity);
    setCartItem(updatedCart);
  };

  // 2-4. 쿠폰 선택하기
  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

  // 2-5. 장바구니 내 모든 상품 총액 계산하기
  const calculateTotal = () => {
    return calculateCartTotal(cart, selectedCoupon);
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
