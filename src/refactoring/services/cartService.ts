import { config } from "../config";
import { CartItem } from "../models";

interface CartService {
  getCart(): Promise<CartItem[]>;
  updateCartItem(item: CartItem): Promise<CartItem>;
  removeCartItem(productId: string): Promise<void>;
}

export const cartService: CartService = {
  getCart: async () => {
    const response = await fetch(`${config.apiUrl}/cart`);
    const { data } = await response.json();
    return data;
  },

  updateCartItem: async (item) => {
    const response = await fetch(`${config.apiUrl}/cart`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    const { data } = await response.json();
    return data;
  },

  removeCartItem: async (productId) => {
    await fetch(`${config.apiUrl}/cart/${productId}`, {
      method: "DELETE",
    });
  },
};
