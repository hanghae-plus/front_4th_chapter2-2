import { http } from "msw";
import { CartItem } from "../../models/cart/types";
import {
  HTTP_STATUS,
  createErrorResponse,
  createSuccessResponse,
} from "../utils/error";
import { storage } from "../utils/storage";

// 초기 상태 로드
let cartItems: CartItem[] = storage.get("cartItems") || [];

export const cartHandlers = [
  // 장바구니 조회
  http.get("/api/cart", () => {
    return createSuccessResponse(cartItems);
  }),

  // 장바구니 추가/수정
  http.put("/api/cart", async ({ request }) => {
    const newItem = (await request.json()) as CartItem;

    const existingIndex = cartItems.findIndex(
      (item) => item.product.id === newItem.product.id
    );

    if (existingIndex >= 0) {
      cartItems[existingIndex] = newItem;
    } else {
      cartItems = [...cartItems, newItem];
    }

    storage.set("cartItems", cartItems);
    return createSuccessResponse(cartItems);
  }),

  // 장바구니 삭제
  http.delete("/api/cart/:productId", ({ params }) => {
    const { productId } = params;

    const existingItem = cartItems.find(
      (item) => item.product.id === productId
    );

    // 이미 삭제된 아이템인 경우 404 반환
    if (!existingItem) {
      return createErrorResponse(
        "상품을 찾을 수 없습니다.",
        HTTP_STATUS.NOT_FOUND
      );
    }

    // 아이템 삭제
    cartItems = cartItems.filter((item) => item.product.id !== productId);
    storage.set("cartItems", cartItems);

    // 성공 응답 (204 No Content)
    return new Response(null, {
      status: HTTP_STATUS.NO_CONTENT,
    });
  }),
];
