// 수량 검증
export const validateQuantity = (quantity: number, stock: number): number => {
  return Math.max(0, Math.min(quantity, stock));
};
