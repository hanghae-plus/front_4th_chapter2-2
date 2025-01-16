import { useState } from 'react';

import { useLocalStorage } from './useLocalStorage';
import { CartItem, Coupon, Product } from '../../types';
import { LOCAL_STORAGE_KEY } from '../constants/localStorage';
import { calculateCartTotal, getRemainingStock, updateCartItemQuantity } from '../models/cart';

export const useCart = () => {
  const { storedValue: cart, saveToStorage: setCart } = useLocalStorage<CartItem[]>(
    LOCAL_STORAGE_KEY['CART'],
    []
  );
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addToCart = (product: Product) => {
    const remainingStock = getRemainingStock(cart, product);

    if (remainingStock <= 0) return;

    const newCart = (() => {
      const existingItem = cart.find((item) => item.product.id === product.id);

      if (existingItem) {
        return cart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        );
      }

      return [...cart, { product, quantity: 1 }];
    })();

    setCart(newCart);
  };

  const removeFromCart = (productId: string) => {
    const newCart = cart.filter((item) => item.product.id !== productId);

    setCart(newCart);
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    const updatedCart = updateCartItemQuantity(cart, productId, newQuantity);

    setCart(updatedCart);
  };

  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

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
