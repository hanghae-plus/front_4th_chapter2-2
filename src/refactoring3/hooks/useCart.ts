import { useEffect, useState } from 'react';
import { CartItem, Coupon, Membership, Product } from '../../types';
import { calculateCartTotal, updateCartItemQuantity } from '../models/cart';
import { Discount, useDiscountCalculator } from './useDiscountCalculator';
import { useLocalStorage } from './useLocalStorage';
import { usePreservedCallback } from './usePreservedCallback';

export const useCart = () => {
  const { getItem, setItem } = useLocalStorage();

  const [cart, setCart] = useState<CartItem[]>(getItem('cart') || []);
  const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const discountCalculator = useDiscountCalculator();

  useEffect(() => {
    setItem('cart', cart);
  }, [cart]);

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
    const { totalBeforeDiscount, totalAfterDiscount } = calculateCartTotal(cart);

    const discounts = [selectedMembership, selectedCoupon].reduce((acc, current) => {
      if (!current) return acc;
      return [...acc, { type: current.discountType, value: current.discountValue }];
    }, [] as Discount[]);

    const finalPrice = discountCalculator(totalAfterDiscount, discounts);

    return {
      totalBeforeDiscount,
      totalAfterDiscount: finalPrice,
      totalDiscount: totalBeforeDiscount - finalPrice,
    };
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
