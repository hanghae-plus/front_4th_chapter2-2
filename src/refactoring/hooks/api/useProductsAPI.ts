import { useQuery } from "@tanstack/react-query";
import { productService } from "../../services";

export const useProductsAPI = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: productService.getProducts,
  });
};
