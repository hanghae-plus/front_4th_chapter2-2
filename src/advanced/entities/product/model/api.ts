import { Product } from '@types';
import { UpdateProduct } from '..';

export const getProducts = async () => {
  const response = await fetch('/api/products', { method: 'GET' });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = (await response.json()) as { products: Product[] };
  return data.products;
};

export const addProduct = async (product: UpdateProduct) => {
  const response = await fetch('/api/products', {
    method: 'PUT',
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = (await response.json()) as Product;
  return data;
};

export const updateProduct = async (
  productId: string,
  product: Partial<UpdateProduct>,
) => {
  const response = await fetch(`/api/products/${productId}`, {
    method: 'PATCH',
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = (await response.json()) as Product;
  return data;
};
