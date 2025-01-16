import { Product } from '../../types.ts';
import { useAsync } from './useAsync.ts';
import { usePreservedCallback } from './usePreservedCallback.ts';

export const useProducts = () => {
  const { data: products, reRun } = useAsync({
    asyncFn: async () => {
      const result = await fetch('/products').then((res) => res.json());
      return result;
    },
  });

  const addProduct = usePreservedCallback(async (product: Product) => {
    await fetch('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
    reRun();
  });

  const updateProduct = usePreservedCallback(async (product: Product) => {
    await fetch('/products', {
      method: 'PATCH',
      body: JSON.stringify(product),
    });
    reRun();
  });

  const deleteProduct = usePreservedCallback((id: string) => {
    fetch(`/products/${id}`, {
      method: 'DELETE',
    });
    reRun();
  });

  return {
    addProduct,
    updateProduct,
    deleteProduct,
    products: products || [],
  };
};
