import { Product } from '../../types';

export const useProductSearch = (products: Product[]) => {
  const searchProduct = (query: string): Product[] => {
    if (!query.trim()) return products;

    return products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase()));
  };

  return searchProduct;
};
