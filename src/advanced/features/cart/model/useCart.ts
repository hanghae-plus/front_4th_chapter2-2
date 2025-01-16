import { create } from 'zustand';
import { Coupon } from '@advanced/entities/coupon';
import { Product } from '@advanced/entities/product';
import { updateCartItemQuantity } from '../lib';
import { CartItem } from './types';

interface CartState {
  cart: CartItem[];
  selectedCoupon: Coupon | null;
}

interface CartAction {
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  applyCoupon: (coupon: Coupon) => void;
}

export const useCart = create<CartState & CartAction>((set) => ({
  cart: [],
  selectedCoupon: null,
  addToCart: (product) => {
    set((prev) => {
      const { cart } = prev;
      const existingItem = cart.find((item) => item.product.id === product.id);
      if (existingItem) {
        return {
          ...prev,
          cart: updateCartItemQuantity(
            cart,
            product.id,
            Math.min(existingItem.quantity + 1, product.stock),
          ),
        };
      }
      return { ...prev, cart: [...cart, { product, quantity: 1 }] };
    });
  },
  removeFromCart: (productId) => {
    set((prev) => {
      const { cart } = prev;
      return {
        ...prev,
        cart: cart.filter((item) => item.product.id !== productId),
      };
    });
  },
  updateQuantity: (productId, newQuantity) => {
    set((prev) => {
      const { cart } = prev;
      return {
        ...prev,
        cart: updateCartItemQuantity(cart, productId, newQuantity),
      };
    });
  },
  applyCoupon: (coupon) => {
    set((prev) => ({ ...prev, selectedCoupon: coupon }));
  },
}));
