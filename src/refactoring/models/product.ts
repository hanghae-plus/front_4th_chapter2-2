import { Product } from '../../types';

// update된 productList 반환
export const updateProductList = (
  productList: Product[],
  updatedProduct: Product,
) => {
  return productList.map((product) =>
    product.id === updatedProduct.id ? updatedProduct : product,
  );
};
