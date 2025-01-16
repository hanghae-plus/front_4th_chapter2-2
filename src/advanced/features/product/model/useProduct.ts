import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import {
  addProduct,
  getProducts,
  UpdateProduct,
  updateProduct,
} from '@advanced/entities/product';

export const useGetProductsQuery = () => {
  return useSuspenseQuery({
    queryKey: ['/api/products'],
    queryFn: () => getProducts(),
  });
};

export const useAddProductMutation = (product: UpdateProduct) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['/api/products'],
    mutationFn: () => addProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
    },
  });
};

export const useUpdateProductMutation = (
  productId: string,
  product: Partial<UpdateProduct>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['/api/products'],
    mutationFn: () => updateProduct(productId, product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
    },
  });
};
