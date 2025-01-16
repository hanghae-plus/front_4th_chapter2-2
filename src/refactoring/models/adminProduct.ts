import { Product } from '../../types.ts';

export const getNewProduct = (updatedProduct: Product, index: number): Product => {
  const discountList = updatedProduct.discountList.filter((_, i) => i !== index);
  return {
    ...updatedProduct,
    discountList,
  };
};
