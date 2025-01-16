import { useState } from "react";
import { Product } from "../../types";

export const useNewProduct = () => {
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: "",
    price: 0,
    stock: 0,
    discounts: [],
  });

  return {
    newProduct,
    setNewProduct,
  };
};
