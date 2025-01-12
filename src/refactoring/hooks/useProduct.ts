import { useState } from 'react';
import { Product } from '../models/types/Product';

export const useProducts = (initialProducts: Product[]) => {
  return {
    products: [],
    updateProduct: () => undefined,
    addProduct: () => undefined,
  };
};
