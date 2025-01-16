import { create } from "zustand";
import { CartItem, Coupon, Product } from "../../types";
import { calculateCartTotal, updateCartItemQuantity } from "../models/cart";

export interface CartTotalDiscount {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
  totalDiscount: number;
}

interface CartStore {
  cart: CartItem[];
  selectedCoupon: Coupon | null;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  applyCoupon: (coupon: Coupon) => void;
  calculateTotal: () => CartTotalDiscount;
}

export const useCartStore = create<CartStore>((set, get) => ({
  cart: [],
  selectedCoupon: null,
  addToCart: (product) => {
    const { cart } = get();
    const existingItem = cart.find((item) => item.product.id === product.id);
    const remainingStock = product.stock - (existingItem?.quantity || 0);

    if (remainingStock < 1) return;
    if (existingItem) {
      set({
        cart: cart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        ),
      });
    } else {
      set({ cart: [...cart, { product, quantity: 1 }] });
    }
  },
  removeFromCart: (productId) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.product.id !== productId),
    }));
  },
  updateQuantity: (productId, newQuantity) => {
    set((state) => ({
      cart: updateCartItemQuantity(state.cart, productId, newQuantity),
    }));
  },
  applyCoupon: (coupon) => {
    set({ selectedCoupon: coupon });
  },
  calculateTotal: () => {
    const { cart, selectedCoupon } = get();
    return calculateCartTotal(cart, selectedCoupon);
  },
}));
