import { CartItem, Coupon, Grade } from "../../types";

/**
 * 상품 총 금액 계산
 * @param item 장바구니 아이템
 * @returns 상품 총 금액
 */
export const calculateItemTotal = (item: CartItem) => {
  const { product, quantity } = item;
  const { price } = product;
  const maxDiscountRate = getMaxApplicableDiscount(item);

  const total = price * quantity;
  const discountedTotal = total * (1 - maxDiscountRate);
  return discountedTotal;
};

/**
 * 최대 적용 할인 계산
 * @param item 장바구니 아이템
 * @returns 최대 적용 할인
 */
export const getMaxApplicableDiscount = (item: CartItem) => {
  const { product, quantity } = item;
  const { discounts } = product;
  const maxDiscountRate = discounts.reduce((max, discount) => {
    if (discount.quantity <= quantity) {
      return Math.max(max, discount.rate);
    }
    return max;
  }, 0);

  return maxDiscountRate;
};

/**
 * 상품 총 금액 계산
 * @param item 장바구니 아이템
 * @returns 상품 총 금액
 */
export function calculateItemSubtotal(item: CartItem): number {
  return item.product.price * item.quantity;
}

/**
 * 상품 총 금액 계산
 * @param item 장바구니 아이템
 * @returns 상품 총 금액
 */
export function calculateBulkDiscount(item: CartItem): number {
  const discount = item.product.discounts?.find(
    (d) => item.quantity >= d.quantity
  );
  if (!discount) return 0;

  return calculateItemSubtotal(item) * discount.rate;
}

/**
 * 쿠폰 할인 계산
 * @param subtotal 상품 총 금액
 * @param coupon 쿠폰
 * @returns 쿠폰 할인
 */
export function applyCouponDiscount(
  subtotal: number,
  coupon: Coupon | null
): number {
  if (!coupon) return subtotal;

  return coupon.discountType === "amount"
    ? subtotal - coupon.discountValue
    : subtotal * (1 - coupon.discountValue / 100);
}

/**
 * 등급 할인 계산
 * @param subtotal 상품 총 금액
 * @param grade 등급
 * @returns 등급 할인
 */
export function applyGradeDiscount(
  subtotal: number,
  grade: Grade | null
): number {
  if (!grade) return subtotal;
  return subtotal * (1 - grade.rate / 100);
}

/**
 * 장바구니 총 금액 계산
 * @param cart 장바구니 목록
 * @param selectedCoupon 선택된 쿠폰
 * @param selectedGrade 선택된 등급
 * @returns 장바구니 총 금액
 */
export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null,
  selectedGrade: Grade | null
) => {
  const totalBeforeDiscount = cart.reduce(
    (total, item) => total + calculateItemSubtotal(item),
    0
  );

  const totalAfterBulkDiscount = cart.reduce(
    (total, item) =>
      total + calculateItemSubtotal(item) - calculateBulkDiscount(item),
    0
  );

  const totalAfterCouponDiscount = applyCouponDiscount(
    totalAfterBulkDiscount,
    selectedCoupon
  );

  const totalAfterDiscount = applyGradeDiscount(
    totalAfterCouponDiscount,
    selectedGrade
  );

  return {
    totalBeforeDiscount,
    totalAfterDiscount,
    totalDiscount: totalBeforeDiscount - totalAfterDiscount,
  };
};
/**
 * 장바구니 아이템 수량 업데이트
 * @param cart 장바구니 목록
 * @param productId 상품 ID
 * @param newQuantity 새로운 수량
 * @returns 업데이트된 장바구니 목록
 */
export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  const updatedCard = cart.map((item) => {
    if (item.product.id === productId) {
      if (newQuantity > item.product.stock) {
        return { ...item, quantity: item.product.stock };
      } else if (newQuantity < 0) {
        return { ...item, quantity: 0 };
      } else {
        return { ...item, quantity: newQuantity };
      }
    }
    return item;
  });
  return updatedCard.filter((item) => item.quantity > 0);
};
