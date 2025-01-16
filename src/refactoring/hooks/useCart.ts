// useCart.ts
import { useState } from 'react';
import { CartItem, Coupon, Product } from '../../types';
import { calculateCartTotal, updateCartItemQuantity } from '../models/cart';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addToCart = (newProduct: Product) => {
    setCart((prevCart: CartItem[]) => {
      const existingItem = prevCart.find((cartItem) => cartItem.product.id === newProduct.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.product.id === newProduct.id
            ? { ...cartItem, quantity: Math.min(cartItem.quantity + 1, newProduct.stock) }
            : cartItem
        );
      }
      return [...prevCart, { product: newProduct, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((prevCart) => {
      return updateCartItemQuantity(prevCart, productId, newQuantity);
      // prevCart
      //   .map((item) => {
      //     if (item.product.id === productId) {
      //       const maxQuantity = item.product.stock;
      //       const updatedQuantity = Math.max(0, Math.min(newQuantity, maxQuantity));
      //       return updatedQuantity > 0 ? { ...item, quantity: updatedQuantity } : null;
      //     }
      //     return item;
      //   })
      //   .filter((item): item is CartItem => item !== null)
    });
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
