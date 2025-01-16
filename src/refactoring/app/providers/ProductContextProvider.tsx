import { IProduct } from '../../shared/types';
import { createContext } from 'react';
import { useProducts } from '../../widgets/product/model';

const initialProducts: IProduct[] = [
  {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.1 }],
  },
  {
    id: 'p2',
    name: '상품2',
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }],
  },
  {
    id: 'p3',
    name: '상품3',
    price: 30000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.2 }],
  },
];

export interface IProductContextType {
  products: IProduct[];
  updateProduct: (product: IProduct) => void;
  addProduct: (product: IProduct) => void;
}

export const ProductContext = createContext<IProductContextType | undefined>(
  undefined,
);

export function ProductContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProductContext.Provider value={useProducts(initialProducts)}>
      {children}
    </ProductContext.Provider>
  );
}
