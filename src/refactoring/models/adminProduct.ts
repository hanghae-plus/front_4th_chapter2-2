import { Product } from '../../types.ts';

export const getNewProduct = (updatedProduct: Product, index: number): Product => {
  const discountList = updatedProduct.discountList.filter((_, i) => i !== index);
  return {
    ...updatedProduct,
    discountList,
  };
};

export const getNewSet = (prevSet: Set<string>, productId: string) => {
  const newSet = new Set(prevSet);
  if (newSet.has(productId)) {
    newSet.delete(productId);
  } else {
    newSet.add(productId);
  }
  return newSet;
};
