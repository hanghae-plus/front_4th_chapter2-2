import {useEffect, useState} from "react";
import {CartItem, Product} from "../../types.ts";

export const useSessionStorage = () => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {

      const savedCart = sessionStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error loading cart from sessionStorage:", error);
      return [];
    }
  });
  
  const addToCart = (product: Product) => {
    const remainingStock = getRemainingStock(product);
    let data = [];
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        );
      }
      data = [...prevCart, { product, quantity: 1 }];
      return data
    });
    sessionStorage.setItem("cart", JSON.stringify(data));
  };
  
  const removeFromCart = (productId: string) => {
    let data = [];
    setCart(prevCart => {
      data = prevCart.filter(item => item.product.id !== productId)
      return data;
    });
    sessionStorage.setItem("cart", JSON.stringify(data));
  };
  
  const getRemainingStock = (product: Product) => {
    const cartItem = cart.find((item : CartItem) => item.product.id === product.id);
    return product.stock - (cartItem?.quantity || 0);
  }
  
  useEffect(() => {
    try {
      sessionStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart to sessionStorage:", error);
    }
  }, [cart]);
  
  return {
    cart,
    setCart,
    addToCart,
    removeFromCart
  };
}
