// useCart.ts
import { useState } from 'react';
import { CartItem, Product } from '../../types';
import {
  checkExistingItem,
  calculateCartTotal,
  filterCartItems,
  updateCartWithNewItem,
  updateCartItemQuantity,
} from '../models';
import { useCoupons } from './useCoupon';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { selectedCoupon, applyCoupon } = useCoupons([]);

  const addToCart = (product: Product) => {
    const remainingStock = getRemainingStock(product);
    if (remainingStock <= 0) return;

    setCart((prevCart) => updateCartWithNewItem(prevCart, product));
  };

  const getRemainingStock = (product: Product) => {
    const cartItem = checkExistingItem(cart, product);
    return product.stock - (cartItem?.quantity || 0);
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => filterCartItems(prevCart, productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((prevCart) =>
      updateCartItemQuantity(prevCart, productId, newQuantity),
    );
  };

  const calculateTotal = () => calculateCartTotal(cart, selectedCoupon);

  return {
    cart: cart,
    addToCart: addToCart,
    getRemainingStock: getRemainingStock,
    removeFromCart: removeFromCart,
    updateQuantity: updateQuantity,
    applyCoupon: applyCoupon,
    calculateTotal: calculateTotal,
    selectedCoupon: selectedCoupon,
  };
};
