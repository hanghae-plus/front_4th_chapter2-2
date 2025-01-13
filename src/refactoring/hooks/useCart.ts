// useCart.ts
import { useState } from "react";
import { CartItem, Coupon, Product } from "../../types";
import { calculateCartTotal, updateCartItemQuantity } from "../models/cart";

const getRemainingStock = ({ cart, product }: { cart: CartItem[], product: Product }) => {
  const cartItem = cart.find(item => item.product.id === product.id);
  return product.stock - (cartItem?.quantity || 0);
};

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addToCart = (product: Product) => {
    const remainingStock = getRemainingStock({ cart, product });
    if (remainingStock <= 0) return;

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity: (productId: string, newQuantity: number) => {
      setCart(cart =>  updateCartItemQuantity({ cart, productId, newQuantity }))
    },
    applyCoupon,
    calculateTotal: () => calculateCartTotal({ cart, selectedCoupon }),
    selectedCoupon,
  };
};
