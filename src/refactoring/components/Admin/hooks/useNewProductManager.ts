import { useState } from "react";
import { Product } from "../../../../types";
import { INITIAL_PRODUCT } from "../../../constants/initialData";

export const useNewProductManager = (
  onProductAdd: (newProduct: Product) => void
) => {
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [newProduct, setNewProduct] =
    useState<Omit<Product, "id">>(INITIAL_PRODUCT);

  const handleProductFieldChange = (
    field: keyof Omit<Product, "id" | "discounts">,
    value: string | number
  ) => {
    setNewProduct((prev) => ({
      ...prev,
      [field]:
        typeof value === "string" && field !== "name" ? parseInt(value) : value,
    }));
  };

  const handleAddNewProduct = () => {
    const productWithId = {
      ...newProduct,
      id: Date.now().toString(),
    };
    onProductAdd(productWithId);
    setNewProduct(INITIAL_PRODUCT);
    setShowNewProductForm(false);
  };

  const toggleNewProductForm = () => {
    setShowNewProductForm((prev) => !prev);
  };

  return {
    showNewProductForm,
    newProduct,
    handleProductFieldChange,
    handleAddNewProduct,
    toggleNewProductForm,
  };
};
