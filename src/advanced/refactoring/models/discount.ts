import { Product } from './types/Product';

const addProductDiscount = (
  product: Product,
  discount: Product['discounts'][0],
) => ({
  ...product,
  discounts: [...product.discounts, discount],
});

const removeProductDiscount = (product: Product, index: number) => ({
  ...product,
  discounts: product.discounts.filter((_, i) => i !== index),
});

export { addProductDiscount, removeProductDiscount };
