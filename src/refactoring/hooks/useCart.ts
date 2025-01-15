import { useEffect, useState } from 'react';

import { useLocalStorage } from './useLocalStorage';
import { CartItem, Coupon, Product } from '../../types';
import { calculateCartTotal, getRemainingStock, updateCartItemQuantity } from '../models/cart';

export const useCart = () => {
  const { saveToStorage, getFromStorage } = useLocalStorage();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    const loadCart = () => {
      const storedItems = getFromStorage();
      if (storedItems.length > 0) {
        setCart(storedItems);
      }
    };

    loadCart();
  }, []);

  const addToCart = (product: Product) => {
    const remainingStock = getRemainingStock(cart, product);
    if (remainingStock <= 0) return;

    setCart((prevCart) => {
      const newCart = (() => {
        const existingItem = prevCart.find((item) => item.product.id === product.id);

        if (existingItem) {
          return prevCart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
              : item
          );
        }

        return [...prevCart, { product, quantity: 1 }];
      })();

      console.log(newCart);
      saveToStorage(newCart);

      return newCart;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item.product.id !== productId);

      saveToStorage(newCart);

      return newCart;
    });
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((prevCart) => {
      const updatedCart = updateCartItemQuantity(prevCart, productId, newQuantity);
      saveToStorage(updatedCart);
      return updatedCart;
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
