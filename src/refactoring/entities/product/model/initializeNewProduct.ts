import { Product } from '../../../shared/types/types';

export const initializeNewProduct = (): Omit<Product, 'id'> => ({
  name: '',
  price: 0,
  stock: 0,
  discounts: [],
});
