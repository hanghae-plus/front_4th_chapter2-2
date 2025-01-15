import { useState } from 'react';
import { CartItem, Coupon, Membership, Product } from '../../types';
import { calculateCartTotal, updateCartItemQuantity } from '../models/cart';
import { usePreservedCallback } from './usePreservedCallback';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addToCart = usePreservedCallback((product: Product) => {
    const remainingStock = getRemainingStock(product);
    if (remainingStock <= 0) return;

    setCart((prev) => {
      const existingItem = prev.find((current) => current.product.id === product.id);

      if (!existingItem) {
        return [...prev, { product, quantity: 1 }];
      }

      return prev.map((current) =>
        current.product.id === product.id
          ? { ...current, quantity: Math.min(current.quantity + 1, product.stock) }
          : current,
      );
    });
  });

  const removeFromCart = usePreservedCallback((productId: string) => {
    setCart((current) => current.filter((current) => current.product.id !== productId));
  });

  const updateQuantity = usePreservedCallback((productId: string, newQuantity: number) => {
    setCart((prev) => updateCartItemQuantity(prev, productId, newQuantity));
  });

  const applyMembership = usePreservedCallback((membership: Membership | null) => {
    setSelectedMembership(membership);
  });

  const applyCoupon = usePreservedCallback((coupon: Coupon | null) => {
    setSelectedCoupon(coupon);
  });

  const getRemainingStock = usePreservedCallback((product: Product) => {
    const cartItem = cart.find((current) => current.product.id === product.id);
    return product.stock - (cartItem?.quantity || 0);
  });

  const getCartItemByProductId = usePreservedCallback((productId: string) => {
    return cart.find((current) => current.product.id === productId);
  });

  const calculateTotal = () => {
    return calculateCartTotal(cart, selectedCoupon);
  };

  return {
    cart,
    selectedMembership,
    selectedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyMembership,
    applyCoupon,
    getRemainingStock,
    getCartItemByProductId,
    calculateTotal,
  };
};
