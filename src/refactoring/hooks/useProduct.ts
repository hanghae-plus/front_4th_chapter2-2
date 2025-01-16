import { Product } from "../../types.ts";
import { useLocalStorage } from "./useLocalStorage.ts";

/**
 * 상품 관리 훅
 * @param initialProducts 초기 상품 목록
 * @returns 상품 목록, 상품 업데이트 함수, 상품 추가 함수
 */
export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useLocalStorage<Product[]>(
    "products",
    initialProducts
  );

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const addProduct = (newProduct: Product) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  return {
    products,
    updateProduct,
    addProduct,
  };
};
