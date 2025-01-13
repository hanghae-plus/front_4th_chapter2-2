import { useState } from "react";
import { CartItem, Product } from "../../types";
import { 
        getMaxApplicableDiscount, 
        calculateItemTotal, 
        calculateCartTotal, 
        updateCartItemQuantity 
      } from "../../refactoring/models/cart";

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    const existItem = cart.find((item) => item.product.id === product.id);
    if (existItem) {
      setCart(updateCartItemQuantity(cart, product.id, existItem.quantity + 1));
      return;
    }

    setCart([...cart, { product, quantity: 1 }]);
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    calculateCartTotal,
    calculateItemTotal,
    getMaxApplicableDiscount,
  };
}