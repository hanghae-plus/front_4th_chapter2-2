import { createContext, useContext } from 'react';
import { Product } from '../../../../types.ts';

interface ProductContextType {
  products: Product[];
  updateProduct: (product: Product) => void;
  addProduct: (product: Product) => void;
}

export const ProductContext = createContext<ProductContextType | null>(null);

export function useProductContext() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductStore must be used within a ProductProvider');
  }
  return context;
}
