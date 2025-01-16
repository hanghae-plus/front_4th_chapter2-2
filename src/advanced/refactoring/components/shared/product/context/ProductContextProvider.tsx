import React, { useMemo, useState } from 'react';
import { ProductContext } from './productContext';
import { Product } from '../../../../models/types/Product';

interface ProductContextProviderProps {
  children: React.ReactNode;
}

function ProductContextProvider({ children }: ProductContextProviderProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const value = useMemo(
    () => ({ products, setProducts }),
    [products, setProducts],
  );

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}

export default ProductContextProvider;
