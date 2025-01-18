import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addProduct, UpdateProduct } from '@advanced/entities/product';

export const useAddProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['/api/products'],
    mutationFn: (product: UpdateProduct) => addProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['/api/products'],
        exact: false,
      });
    },
  });
};
