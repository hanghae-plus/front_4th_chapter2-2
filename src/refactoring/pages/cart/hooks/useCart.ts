import { useState, useEffect } from "react";
import { CartItem, Coupon, Product } from "../../../../types";
import { updateCartItemQuantity } from "../models/cart";
import { useDiscountCalculator } from "./useDiscountCalculator";

interface UseCartOptions {
  useLocalStorage?: boolean; // 로컬 스토리지 사용 여부
}

export const useCart = ({ useLocalStorage = false }: UseCartOptions = {}) => {
  const CART_KEY = "cart";

  const [cart, setCart] = useState<CartItem[]>(() => {
    if (useLocalStorage) {
      const storedCart = localStorage.getItem(CART_KEY);
      return storedCart ? JSON.parse(storedCart) : [];
    }
    return [];
  });

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    if (useLocalStorage) {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
  }, [cart, useLocalStorage]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product.id === product.id
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId)
    );
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((prevCart) =>
      updateCartItemQuantity(prevCart, productId, newQuantity)
    );
  };

  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

  const calculateTotal = useDiscountCalculator(cart, selectedCoupon);

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
