import { useCallback, useState } from "react";
import { CartItem, Coupon, Product } from "../../types";
import { calculateTotal as calculateDiscount } from "../utils/cartDiscountUtils";

interface CartState {
  cart: Array<CartItem>;
  selectedCoupon: Coupon | null;
  addToCart: (product: Product) => void;
  applyCoupon: (coupon: Coupon) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  calculateTotal: () => {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
    totalDiscount: number;
  };
}

export const useCart = (): CartState => {
  const [cart, setCart] = useState<Array<CartItem>>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const getRemainingStock = useCallback(
    (product: Product) => {
      const cartItem = cart.find((item) => item.product.id === product.id);
      return product.stock - (cartItem?.quantity || 0);
    },
    [cart]
  );

  const addToCart = useCallback(
    (product: Product) => {
      const remainingStock = getRemainingStock(product);
      if (remainingStock <= 0) return;

      setCart((prevCart) => {
        const existingItem = prevCart.find(
          (item) => item.product.id === product.id
        );
        if (existingItem) {
          return prevCart.map((item) =>
            item.product.id === product.id
              ? {
                  ...item,
                  quantity: Math.min(item.quantity + 1, product.stock),
                }
              : item
          );
        }
        return [...prevCart, { product, quantity: 1 }];
      });
    },
    [getRemainingStock]
  );

  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId)
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      setCart((prevCart) =>
        prevCart
          .map((item) => {
            if (item.product.id === productId) {
              const maxQuantity = item.product.stock;
              const updatedQuantity = Math.max(
                0,
                Math.min(newQuantity, maxQuantity)
              );
              return updatedQuantity > 0
                ? { ...item, quantity: updatedQuantity }
                : null;
            }
            return item;
          })
          .filter((item): item is CartItem => item !== null)
      );
    },
    []
  );

  const applyCoupon = useCallback((coupon: Coupon) => {
    setSelectedCoupon(coupon);
  }, []);

  const calculateTotal = useCallback(() => {
    return calculateDiscount(cart, selectedCoupon);
  }, [cart, selectedCoupon]);

  return {
    cart,
    addToCart,
    applyCoupon,
    selectedCoupon,
    removeFromCart,
    updateQuantity,
    calculateTotal,
  };
};
