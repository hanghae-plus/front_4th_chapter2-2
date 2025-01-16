import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import {
  addProduct,
  getProductById,
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

export const useGetProductByIdQuery = (productId: string) => {
  return useSuspenseQuery({
    queryKey: ['/api/products', productId],
    queryFn: () => getProductById(productId),
  });
};

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
