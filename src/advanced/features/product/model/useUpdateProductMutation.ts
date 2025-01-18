import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProduct, UpdateProduct } from '@advanced/entities/product';

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['/api/products'],
    mutationFn: ({
      productId,
      product,
    }: {
      productId: string;
      product: Partial<UpdateProduct>;
    }) => updateProduct(productId, product),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['/api/products'],
        exact: false,
      });
    },
  });
};
