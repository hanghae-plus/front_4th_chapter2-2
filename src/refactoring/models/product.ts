import { Discount, Product } from '../../types';

// update된 productList 반환
export const updateProductList = (
  productList: Product[],
  updatedProduct: Product,
) => {
  return productList.map((product) =>
    product.id === updatedProduct.id ? updatedProduct : product,
  );
};

export const checkProduct = (productList: Product[], productId: string) => {
  return productList.find((product) => product.id === productId);
};

export const updateProductNewDiscount = (
  product: Product,
  discounts: Discount,
) => {
  return { ...product, discounts: [...product.discounts, discounts] };
};

export const removeProductDiscount = (product: Product, index: number) => {
  return {
    ...product,
    discounts: product.discounts.filter((_, i) => i !== index),
  };
};

export const addNewProduct = (newProduct: Omit<Product, 'id'>) => {
  return { ...newProduct, id: Date.now().toString() };
};
