import { useEffect, useState } from 'react';
import { Product } from '../../types.ts';

// useProducts : 상품의 엔티티 상태(init/update/add)를 담당하는 커스텀 훅
export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  useEffect(() => {
    // 예외처리 및 상태 init
    if (initialProducts) setProducts(initialProducts);
  }, [initialProducts]);

  // 상품 업데이트
  const updateProduct = (product: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((prod) =>   
        prod.id === product.id ? { ...prod, ...product } : prod
      )
    );
  };

  // 상품 추가
  const addProduct = (product: Product) => setProducts([...products, product])

  return {
    products, 
    updateProduct,
    addProduct
  };
};
