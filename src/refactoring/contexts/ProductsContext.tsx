import { createContext, useContext, ReactNode } from "react";
import { Product } from "../../types";
import { useProducts } from "../hooks";

interface ProductsContextProps {
  products: Product[];
  onProductUpdate: (updatedProduct: Product) => void;
  onProductAdd: (newProduct: Product) => void;
}

const ProductsContext = createContext<ProductsContextProps | undefined>(
  undefined
);

export const ProductsProvider = ({
  children,
  initialProducts,
}: {
  children: ReactNode;
  initialProducts: Product[];
}) => {
  const { products, updateProduct, addProduct } = useProducts(initialProducts);

  return (
    <ProductsContext.Provider
      value={{
        products,
        onProductUpdate: updateProduct,
        onProductAdd: addProduct,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProductsContext = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error(
      "useProductsContext must be used within a ProductsProvider"
    );
  }
  return context;
};
