import { http } from "msw";
import { Product } from "../../models/cart/types";
import { ProductParams } from "../types";
import {
  HTTP_STATUS,
  createErrorResponse,
  createSuccessResponse,
} from "../utils/error";
import { parseRequest } from "../utils/request";
import { storage } from "../utils/storage";
import { initialProducts } from "../data/products";

// 초기 상태 로드
let products = storage.get("products") || initialProducts;

export const productHandlers = [
  // 상품 목록 조회
  http.get("/api/products", () => {
    return createSuccessResponse(products);
  }),

  // 상품 추가
  http.post("/api/products", async ({ request }) => {
    const newProduct = await parseRequest<Product>(request);
    products = [...products, newProduct];
    storage.set("products", products);
    return createSuccessResponse(newProduct, HTTP_STATUS.CREATED);
  }),

  // 상품 수정
  http.put<ProductParams>("/api/products/:id", async ({ params, request }) => {
    const updatedProduct = await parseRequest<Product>(request);
    products = products.map((product: Product) =>
      product.id === params.id ? updatedProduct : product
    );
    storage.set("products", products);
    return createSuccessResponse(updatedProduct);
  }),

  // 상품 삭제
  http.delete<ProductParams>("/api/products/:id", ({ params }) => {
    products = products.filter((product: Product) => product.id !== params.id);
    storage.set("products", products);

    return new Response(null, {
      status: HTTP_STATUS.NO_CONTENT,
    });
  }),
];
