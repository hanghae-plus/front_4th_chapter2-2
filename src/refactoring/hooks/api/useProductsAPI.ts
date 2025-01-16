import { useState, useEffect } from "react";
import { Product } from "../../models";
import { productService } from "../../services";
import { config } from "../../config";

export const useProductsAPI = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  useEffect(() => {
    if (config.isApiMockMode) {
      productService.getProducts().then(setProducts).catch(console.error);
    }
  }, []);

  const updateProduct = async (id: string, updatedProduct: Product) => {
    try {
      const result = await productService.updateProduct(id, updatedProduct);
      setProducts(products.map((p) => (p.id === id ? result : p)));
      return result;
    } catch (error) {
      console.error("Failed to update product:", error);
      throw error;
    }
  };

  const addProduct = async (product: Product) => {
    try {
      const result = await productService.addProduct(product);
      setProducts([...products, result]);
      return result;
    } catch (error) {
      console.error("Failed to add product:", error);
      throw error;
    }
  };

  return { products, updateProduct, addProduct };
};
