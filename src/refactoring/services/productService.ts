import { config } from "../config";
import { Product } from "../models";

interface ProductService {
  getProducts(): Promise<Product[]>;
  addProduct(product: Product): Promise<Product>;
  updateProduct(id: string, product: Product): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
}

export const productService: ProductService = {
  getProducts: async () => {
    const response = await fetch(`${config.apiUrl}/products`);
    const { data } = await response.json();
    return data;
  },

  addProduct: async (product) => {
    const response = await fetch(`${config.apiUrl}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    const { data } = await response.json();
    return data;
  },

  updateProduct: async (id, product) => {
    const response = await fetch(`${config.apiUrl}/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    const { data } = await response.json();
    return data;
  },

  deleteProduct: async (id) => {
    await fetch(`${config.apiUrl}/products/${id}`, {
      method: "DELETE",
    });
  },
};
