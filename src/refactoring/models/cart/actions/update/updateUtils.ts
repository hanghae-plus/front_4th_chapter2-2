import { CartItem } from "../../types";

// 아이템 업데이트 (수량 등)
export const updateItem = (
  item: CartItem,
  quantity: number
): CartItem | null => {
  // 유효하지 않은 수량이면 해당 아이템 제거
  if (quantity <= 0) return null;

  // 유효한 수량이면 업데이트
  return {
    ...item,
    quantity,
  };
};
