import { IProduct } from '../../shared/types';
import { createContext } from 'react';
import { useProducts } from '../../widgets/product/model';

export interface IProductContext {
  products: IProduct[];
  updateProduct: (product: IProduct) => void;
  addProduct: (product: IProduct) => void;
  findProduct: (productId: string) => IProduct | undefined;
}

export const ProductContext = createContext<IProductContext | undefined>(
  undefined,
);

export function ProductContextProvider({
  initialProducts,
  children,
}: {
  initialProducts: IProduct[];
  children: React.ReactNode;
}) {
  const productContextValue = useProducts(initialProducts);

  return (
    <ProductContext.Provider value={productContextValue}>
      {children}
    </ProductContext.Provider>
  );
}
