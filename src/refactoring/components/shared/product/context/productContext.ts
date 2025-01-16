import { createContext } from 'react';
import { Product } from '../../../../models/types/Product';

export interface ProductContextProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const ProductContext = createContext<ProductContextProps | undefined>(
  undefined,
);

export { ProductContext };
