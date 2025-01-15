import { Product } from "../../types.ts";
import { useStateByMode } from "./useStateByMode.ts";
import { API, LOCAL_KEYS } from "../../const.ts";

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useStateByMode<Product[]>(
    LOCAL_KEYS.PRODUCT,
    API.PRODUCT,
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
