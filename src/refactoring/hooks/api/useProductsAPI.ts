import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "../../services";
import { Product } from "../../models/cart/types";

export const useProductsAPI = () => {
  const queryClient = useQueryClient();

  // 상품 목록 조회
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => productService.getProducts(),
  });

  // 상품 추가
  const addProduct = useMutation({
    mutationFn: (newProduct: Product) => productService.addProduct(newProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  // 상품 수정
  const updateProduct = useMutation({
    mutationFn: ({ id, product }: { id: string; product: Product }) =>
      productService.updateProduct(id, product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  // 상품 삭제
  const deleteProduct = useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return {
    products,
    addProduct: addProduct.mutate,
    updateProduct: updateProduct.mutate,
    deleteProduct: deleteProduct.mutate,
  };
};
