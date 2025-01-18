import { useSuspenseQuery } from '@tanstack/react-query';
import { getProductById } from '@advanced/entities/product';

export const useGetProductByIdQuery = (productId: string) => {
  return useSuspenseQuery({
    queryKey: ['/api/products', productId],
    queryFn: () => getProductById(productId),
  });
};
