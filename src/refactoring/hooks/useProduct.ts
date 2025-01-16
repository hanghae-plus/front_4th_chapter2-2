import { Product } from '../../types.ts';
import { useLocalStorage } from './useLocalStorage.ts';

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useLocalStorage<Product[]>('product', initialProducts);

  const updateProduct = (targetProduct: Product) => {
    setProducts((prev) =>
      prev.map((product) => (product.id === targetProduct.id ? targetProduct : product)),
    );
  };

  const addProduct = (newProduct: Product) => {
    setProducts((prev) => [...prev, newProduct]);
  };

  return { products, updateProduct, addProduct };
};
