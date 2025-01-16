import { useEffect, useState } from "react";
import { CartItem, Coupon, Product } from "../../types";
import { calculateCartTotal } from "../models/cart";

export const CART_LOCAL_STORAGE_KEY = "shopping-cart";
export const COUPON_LOCAL_STORAGE_KEY = "shopping-cart-coupon";

export const useCartLocalStorage = () => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem(CART_LOCAL_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(() => {
    const savedCoupon = localStorage.getItem(COUPON_LOCAL_STORAGE_KEY);
    return savedCoupon ? JSON.parse(savedCoupon) : null;
  });

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((currentCart) => {
      const existingItemIndex = currentCart.findIndex(
        (item) => item.product.id === product.id,
      );

      if (existingItemIndex >= 0) {
        const updatedCart = [...currentCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + quantity,
        };
        return updatedCart;
      }

      return [...currentCart, { product, quantity }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.product.id !== productId),
    );
  };

  const applyCoupon = (coupon: Coupon | null) => {
    setSelectedCoupon(coupon);
  };

  const calculateTotal = () => {
    return calculateCartTotal(cart, selectedCoupon);
  };

  useEffect(() => {
    localStorage.setItem(CART_LOCAL_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(
      COUPON_LOCAL_STORAGE_KEY,
      JSON.stringify(selectedCoupon),
    );
  }, [selectedCoupon]);

  return {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    calculateTotal,
    selectedCoupon,
  };
};
