import { useState } from "react";
import { Product } from "../../types";

export const useProducts = (initialProducts: Product[]) => {
  // 1. 제품 상태 정의
  const [products, setProducts] = useState<Product[]>(initialProducts);

  // 2. 제품 업데이트 함수
  const updateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      // 상태 배열에서 id가 같은 제품을 업데이트. 아니면 유지
      prev.map((product) => (product.id === updatedProduct.id ? updatedProduct : product))
    );
  };

  // 3. 제품 추가 함수
  const addProduct = (newProduct: Product) => {
    setProducts((prev) => {
      // 중복 확인
      if (prev.find((product) => product.name === newProduct.name)) {
        console.error("이미 사용중인 상품명 입니다.");
      }
      return [...prev, newProduct]; // 기존 상태 유지, 새 제품 추가
    });
  };

  // 4. 제품 제거 함수
  const removeProduct = (productId: string) => {
    // 상태 배열에서 주어진 id와 다른 제품만 남김
    setProducts((prev) => prev.filter((product) => product.id !== productId));
  };

  // 5. 최대 할인율 계산 함수
  const getMaxDiscount = (discounts: { quantity: number; rate: number }[]): number => {
    // 배열을 순회하며 가장 높은 rate(할인율) 반환
    return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0);
  };

  return {
    products,
    updateProduct,
    addProduct,
    removeProduct,
    getMaxDiscount,
  };
};