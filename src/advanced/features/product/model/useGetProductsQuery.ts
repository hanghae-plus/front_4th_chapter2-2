import { useSuspenseQuery } from '@tanstack/react-query';
import { getProducts } from '@advanced/entities/product';

export const useGetProductsQuery = () => {
  return useSuspenseQuery({
    queryKey: ['/api/products'],
    queryFn: () => getProducts(),
  });
};
