import { Product } from '../../types.ts';
import useAdminEditProduct from './useAdminEditProduct.ts';
import useAdminNewDiscount from './useAdminNewDiscount.ts';

interface UseAdminProps {
  productList: Product[];
  onProductUpdate: (product: Product) => void;
}

const useAdminProductList = ({ productList, onProductUpdate }: UseAdminProps) => {
  const { editingProduct, handleEditProduct, ...editProps } = useAdminEditProduct({
    productList,
    onProductUpdate,
  });

  const { newDiscount, resetNewDiscount, ...discountProps } = useAdminNewDiscount();

  const handleAddDiscount = (productId: string) => {
    const updatedProduct = productList.find((p) => p.id === productId);
    if (updatedProduct && editingProduct) {
      const newProduct: Product = {
        ...updatedProduct,
        discountList: [...updatedProduct.discountList, newDiscount],
      };
      onProductUpdate(newProduct);
      handleEditProduct(newProduct);
      resetNewDiscount();
    }
  };

  return {
    editingProduct,
    newDiscount,
    handleEditProduct,
    handleAddDiscount,
    ...editProps,
    ...discountProps,
  };
};

export default useAdminProductList;
