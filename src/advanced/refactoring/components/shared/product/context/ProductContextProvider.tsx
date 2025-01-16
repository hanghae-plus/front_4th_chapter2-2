/* eslint-disable react/require-default-props */
import React, { useMemo, useState } from 'react';
import { ProductContext } from './productContext';
import { Product } from '../../../../models/types/Product';

interface ProductContextProviderProps {
  initProducts?: Product[];
  children: React.ReactNode;
}

function ProductContextProvider({
  initProducts = [],
  children,
}: ProductContextProviderProps) {
  const [products, setProducts] = useState<Product[]>(initProducts);
  const value = useMemo(
    () => ({ products, setProducts }),
    [products, setProducts],
  );

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}

export default ProductContextProvider;
