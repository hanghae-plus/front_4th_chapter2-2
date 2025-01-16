import { useState } from 'react';

import type { Product } from '@/types';

// Q. 실무에서 여러 곳에서 사용하는 상수가 아니면 const폴더에 몰아두는 것 보다 product 관심사가 있는 이 곳에 두는 것을 선호했었는데,
// entity 폴더를 생성해서 그 곳에 모두 모아두는 것이 좋을까요?
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.1 },
      { quantity: 20, rate: 0.2 }
    ]
  },
  {
    id: 'p2',
    name: '상품2',
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }]
  },
  {
    id: 'p3',
    name: '상품3',
    price: 30000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.2 }]
  }
];

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prevProducts =>
      prevProducts.map(product => (product.id === updatedProduct.id ? updatedProduct : product))
    );
  };

  const addProduct = (newProduct: Product) => {
    setProducts(prevProducts => [...prevProducts, newProduct]);
  };

  return { products, updateProduct, addProduct };
};
