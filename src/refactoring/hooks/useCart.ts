// useCart.ts
import { useState } from 'react';
import { CartItem, Coupon, Product } from '../../types';
import { calculateCartTotal, findExistingItem, updateCartItemQuantity } from '../models/cart';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const calculateNewCart = (prevCart: CartItem[], product: Product): CartItem[] => {
    const existingItem = findExistingItem(prevCart, product);

    if (existingItem) {
      return updateCartItemQuantity(prevCart, product.id, existingItem.quantity + 1);
    }

    return [...prevCart, { product, quantity: 1 }];
  };

  const addToCart = (product: Product) => {
    setCart((preCart) => calculateNewCart(preCart, product));
  };

  const removeFromCart = (productId: string) => {
    const newCart = cart.filter((cartItem) => cartItem.product.id !== productId);
    setCart(newCart);
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((preCart) => updateCartItemQuantity(preCart, productId, newQuantity));
  };

  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

  const calculateTotal = () => calculateCartTotal(cart, selectedCoupon);

  return {
    cart,
    addToCart,
    removeFromCart,
    applyCoupon,
    calculateTotal,
    updateQuantity,
    selectedCoupon,
  };
};
