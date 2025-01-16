import { http } from "msw";
import { Product } from "../../models/cart/types";
import { ProductParams } from "../types";
import {
  HTTP_STATUS,
  createErrorResponse,
  createSuccessResponse,
} from "../utils/error";
import { parseRequest } from "../utils/request";
import { products, findProduct, updateProducts } from "../utils/product";

export const productHandlers = [
  // 상품 목록 조회
  http.get("/api/products", () => {
    console.log("Intercepted GET /api/products request");
    const response = createSuccessResponse(products);
    console.log("Sending response:", response);
    return response;
  }),

  // 상품 추가
  http.post("/api/products", async ({ request }) => {
    const newProduct = await parseRequest<Product>(request);

    if (findProduct(newProduct.id)) {
      return createErrorResponse(
        "이미 존재하는 상품 ID입니다.",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    updateProducts([...products, newProduct]);
    return createSuccessResponse(newProduct, HTTP_STATUS.CREATED);
  }),

  // 상품 수정
  http.put<ProductParams>("/api/products/:id", async ({ params, request }) => {
    const updatedProduct = await parseRequest<Product>(request);

    if (!findProduct(params.id)) {
      return createErrorResponse("상품을 찾을 수 없습니다.");
    }

    updateProducts(
      products.map((product) =>
        product.id === params.id ? updatedProduct : product
      )
    );

    return createSuccessResponse(updatedProduct);
  }),

  // 상품 삭제
  http.delete<ProductParams>("/api/products/:id", ({ params }) => {
    if (!findProduct(params.id)) {
      return createErrorResponse("상품을 찾을 수 없습니다.");
    }

    updateProducts(products.filter((product) => product.id !== params.id));
    return createSuccessResponse(null, HTTP_STATUS.NO_CONTENT);
  }),
];
