// useCartState.ts
import { useCallback, useState } from "react";
import { CartItem, Coupon, Product } from "../../types";
import { calculateCartTotal, updateCartItemQuantity } from "../models/cart";

export const useCartState = (
  initialCart: CartItem[] = [],
  initialCoupon: Coupon | null = null,
) => {
  const [cart, setCart] = useState<CartItem[]>(initialCart);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(
    initialCoupon,
  );

  const addToCart = useCallback((product: Product) => {
    setCart((prevCart) => {
      const cartItem = prevCart.find((item) => item.product.id === product.id);
      const currentQuantity = cartItem?.quantity || 0;

      if (currentQuantity >= product.stock) {
        return prevCart;
      }

      if (cartItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: Math.min(item.quantity + 1, product.stock),
              }
            : item,
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId),
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      setCart((prevCart) =>
        updateCartItemQuantity(prevCart, productId, newQuantity),
      );
    },
    [],
  );

  const applyCoupon = useCallback((coupon: Coupon | null) => {
    setSelectedCoupon(coupon);
  }, []);

  const calculateTotal = useCallback(() => {
    return calculateCartTotal(cart, selectedCoupon);
  }, [cart, selectedCoupon]);

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
