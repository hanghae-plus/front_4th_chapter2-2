import { ReactNode, useMemo } from 'react';
import { Product } from '../../../../types.ts';
import { useProducts } from '../../../features/product/model/useProduct.ts';
import { ProductContext } from '../model/useProductContext.ts';

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
