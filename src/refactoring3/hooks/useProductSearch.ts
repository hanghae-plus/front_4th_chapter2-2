import { Product } from '../../types';

export const useProductSearch = (products: Product[], keyword: string) => {
  return products.filter((product) => product.name.includes(keyword));
};
