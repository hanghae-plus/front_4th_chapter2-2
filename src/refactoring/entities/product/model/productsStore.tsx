import { Product } from '@/shared/types';
import { create } from 'zustand';

interface ProductState {
  products: Product[];
  setProducts: (products: Product[]) => void;
  handleProductUpdate: (updatedProduct: Product) => void;
  handleProductAdd: (newProduct: Product) => void;
}

export const useProductsStore = create<ProductState>((set) => ({
  products: [],

  setProducts: (products: Product[]) => {
    set({ products });
  },

  handleProductUpdate: (updatedProduct: Product) => {
    set((state) => ({
      products: state.products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)),
    }));
  },

  handleProductAdd: (newProduct: Product) => {
    set((state) => ({
      products: [...state.products, newProduct],
    }));
  },
}));
