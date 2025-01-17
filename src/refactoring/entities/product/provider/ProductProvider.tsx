import { ReactNode, useMemo } from 'react';
import { Product } from '../../../../types';
import { useProduct } from '../model/useProduct.ts';
import { ProductContext } from '../model/useProductContext';

export function ProductProvider({
  children,
  initialProducts,
}: {
  children: ReactNode;
  initialProducts: Product[];
}) {
  const { products, updateProduct, addProduct } = useProduct(initialProducts);

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
