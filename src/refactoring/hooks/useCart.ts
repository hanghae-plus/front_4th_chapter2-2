// useCart.ts
import { useState } from 'react';
import { CartItem, Coupon, Product } from '../../types';
import { calculateCartTotal, updateCartItemQuantity } from '../models/cart';
import { useLocalStorage } from './useLocalStorage';

// 2. 장바구니 내역 나타내기
export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const [storedItem, setCartItem, removeCartItem] = useLocalStorage('cart-item', '');

  const getRemainingStock = (product: Product) => {
    const cartItem = cart.find((item) => item.product.id === product.id);
    return product.stock - (cartItem?.quantity || 0);
  };

  // 2-1. 장바구니 내역에 상품 담기
  // 2-1. 계산: calculateAddToCart()
  const calculateAddToCart = (cart: CartItem[], product: Product) => {
    const remainingStock = getRemainingStock(product);
    if (remainingStock <= 0) return cart;

    const exisitingItem = cart.find((item) => item.product.id === product.id);
    if (exisitingItem) {
      return cart.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
          : item
      );
    }

    return [...cart, { product, quantity: 1 }];
  };

  // 2-1. 액션: addToCart()
  const addToCart = (product: Product) => {
    setCart((prevCart) => calculateAddToCart(prevCart, product));
    setCartItem(product);
  };

  // 2-2. 장바구니 내역에 상품 삭제하기
  // 2-2. 계산+액션: removeFromCart()
  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
    removeCartItem();
  };

  // 2-3. 장바구니 내역에 상품의 갯수 조절하기
  // 2-3. 액션: updateQuantity()
  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((prevCart) => updateCartItemQuantity(prevCart, productId, newQuantity));
  };

  // 2-4. 쿠폰 선택하기
  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

  // 2-5. 장바구니 내 모든 상품 총액 계산하기
  // 2-5. 액션: calculateTotal()
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
