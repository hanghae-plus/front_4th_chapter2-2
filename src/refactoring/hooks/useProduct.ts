import useProductStore from "../store/useProductStore";

export const useProducts = () => {
  const {
    products,
    openProductIds,
    selectedProducts,
    isNewProductForm,
    editingProduct,
    initialProducts,
    addProduct,
    completeProductEdit,
    updateProduct,
    updateEditProduct,
    removeDiscount,
    handleNewDiscount,
    newDiscount,
    addProductDiscount,
  } = useProductStore();

  return {
    products,
    isNewProductForm,
    openProductIds,
    editingProduct,
    selectedProducts,
    initialProducts,
    addProduct,
    completeProductEdit,
    updateEditProduct,
    updateProduct,
    removeDiscount,
    handleNewDiscount,
    newDiscount,
    addProductDiscount,
  };
};
