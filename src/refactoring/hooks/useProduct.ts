import { useState } from "react";
import { Product } from "../../types";

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState(initialProducts);

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prevProducts: Product[]) =>
      prevProducts.map((product) =>
        product.id === updatedProduct.id
          ? { ...product, ...updatedProduct }
          : product
      )
    );
  };

  const addProduct = (newProduct: Product) => {
    setProducts((prevProducts: Product[]) => [...prevProducts, newProduct]);
  };

  const handleRemoveProduct = (productId: string) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== productId)
    );
  };

  return {
    products,
    updateProduct,
    addProduct,
    handleRemoveProduct,
  };
};
