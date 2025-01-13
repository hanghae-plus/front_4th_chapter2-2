import { CartItem, Coupon } from '../../types';

/**
 * 한 종류의 상품 가격을 계산하는 함수
 * - 할인 적용 가능 시 최대 할인 적용하여 계산
 */
export const calculateItemTotal = (item: CartItem): number =>
  applyDiscount(item.product.price * item.quantity, getMaxApplicableDiscount(item));

/**
 * 할인 금액을 적용하는 함수
 */
const applyDiscount = (amount: number, discountRate: number): number =>
  discountRate > 0 ? amount * (1 - discountRate) : amount;

/**
 * 최대 할인율을 계산하는 함수
 */
export const getMaxApplicableDiscount = (item: CartItem) =>
  item.product.discounts
    .filter((discount) => item.quantity >= discount.quantity)
    .reduce((max, discount) => Math.max(max, discount.rate), 0);

/**
 * 카트 총합을 계산하는 함수
 */
export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null) => {
  const totalBeforeDiscount = calculateTotal(cart, (item) => item.product.price * item.quantity);
  const totalAfterDiscount = calculateTotal(cart, calculateItemTotal);

  const couponDiscount = calculateCouponDiscount(totalAfterDiscount, selectedCoupon);

  return {
    totalBeforeDiscount,
    totalAfterDiscount: totalAfterDiscount - couponDiscount,
    totalDiscount: totalBeforeDiscount - (totalAfterDiscount - couponDiscount),
  };
};

/**
 * 모든 아이템의 총합을 계산하는 유틸 함수
 */
const calculateTotal = (cart: CartItem[], calculateFn: (item: CartItem) => number): number =>
  cart.reduce((total, item) => total + calculateFn(item), 0);

/**
 * 쿠폰 할인 금액 계산
 */
const calculateCouponDiscount = (totalAfterDiscount: number, coupon: Coupon | null): number => {
  if (!coupon) return 0;

  return coupon.discountType === 'amount'
    ? coupon.discountValue
    : totalAfterDiscount * (coupon.discountValue / 100);
};

/**
 * 카트 아이템 수량을 업데이트하는 함수
 */
export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number,
): CartItem[] =>
  cart
    .map((item) => (item.product.id === productId ? updateItemQuantity(item, newQuantity) : item))
    .filter(Boolean) as CartItem[];

/**
 * 단일 아이템의 수량을 업데이트하는 함수
 */
const updateItemQuantity = (item: CartItem, newQuantity: number): CartItem | null => {
  const maxStock = item.product.stock || Infinity;
  const updatedQuantity = Math.min(newQuantity, maxStock);

  return updatedQuantity > 0 ? { ...item, quantity: updatedQuantity } : null;
};
