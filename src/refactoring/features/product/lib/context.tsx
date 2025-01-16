import { createContext, useContext, ReactNode, useMemo } from 'react';
import { useProducts } from '../model/useProduct';
import { Product } from '../../../../types';

interface ProductContextType {
  products: Product[];
  updateProduct: (product: Product) => void;
  addProduct: (product: Product) => void;
}

const ProductContext = createContext<ProductContextType | null>(null);

export function useProductContext() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductStore must be used within a ProductProvider');
  }
  return context;
}

export function ProductProvider({
  children,
  initialProducts,
}: {
  children: ReactNode;
  initialProducts: Product[];
}) {
  const { products, updateProduct, addProduct } = useProducts(initialProducts);

  const value = useMemo(
    () => ({
      products,
      updateProduct,
      addProduct,
    }),
    [products, updateProduct, addProduct],
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}
