import { useEffect } from "react";
import { useCartState } from "./useCartState";

export const CART_LOCAL_STORAGE_KEY = "shopping-cart";
export const COUPON_LOCAL_STORAGE_KEY = "shopping-cart-coupon";

export const useCartLocalStorage = () => {
  const initialCart = (() => {
    const savedCart = localStorage.getItem(CART_LOCAL_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  })();

  const initialCoupon = (() => {
    const savedCoupon = localStorage.getItem(COUPON_LOCAL_STORAGE_KEY);
    return savedCoupon ? JSON.parse(savedCoupon) : null;
  })();

  const cartState = useCartState(initialCart, initialCoupon);
  const { cart, selectedCoupon } = cartState;

  useEffect(() => {
    localStorage.setItem(CART_LOCAL_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (selectedCoupon) {
      localStorage.setItem(
        COUPON_LOCAL_STORAGE_KEY,
        JSON.stringify(selectedCoupon),
      );
    } else {
      localStorage.removeItem(COUPON_LOCAL_STORAGE_KEY);
    }
  }, [selectedCoupon]);

  return cartState;
};
