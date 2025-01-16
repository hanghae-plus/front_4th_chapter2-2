import { Product } from "../../models/cart/types";
import { initialProducts } from "../data/products";

export let products = [...initialProducts];

// 상품 조회
export const getProducts = () => products;

// 상품 찾기
export const findProduct = (id: string) => products.find((p) => p.id === id);

// 상품 추가
export const addProduct = (product: Product) => {
  products = [...products, product];
  return product;
};

// 상품 수정
export const updateProduct = (id: string, product: Product) => {
  products = products.map((p) => (p.id === id ? product : p));
  return product;
};

// 상품 삭제
export const deleteProduct = (id: string) => {
  products = products.filter((p) => p.id !== id);
};

// 상품 목록 전체 업데이트
export const updateProducts = (newProducts: Product[]) => {
  products = newProducts;
};
