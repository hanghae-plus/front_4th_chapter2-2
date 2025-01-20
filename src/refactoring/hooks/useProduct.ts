import { Product } from "../../types.ts";
import { useStateByMode } from "./useStateByMode.ts";

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useStateByMode<Product[]>(
    "PRODUCT",
    initialProducts,
  );

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === updatedProduct.id ? updatedProduct : p,
      ),
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
