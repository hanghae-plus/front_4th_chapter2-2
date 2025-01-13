import { Product } from '../../types';

export const useProducts = (initialProducts: Product[]) => ({
  products: [],
  updateProduct: () => undefined,
  addProduct: () => undefined,
});
