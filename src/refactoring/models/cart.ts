import { CartItemType, CouponType, DiscountType } from '../types';

/**
 * 장바구니 아이템 총액 계산 (할인 반영)
 * @param {number} price - 상품 가격
 * @param {number} quantity - 상품 수량
 * @param {number} discountRate - 적용된 할인율
 * @returns {number} - 총액
 */
const calculateTotalWithDiscount = (
  price: number,
  quantity: number,
  discountRate: number,
): number => price * quantity * (1 - discountRate);

/**
 * 상품 총액 계산 (수량 및 할인 반영)
 * @param {CartItemType} item - 장바구니 아이템
 * @returns {number} - 총액
 */
export const calculateItemTotal = (item: CartItemType): number => {
  const { price } = item.product;
  const discount = getMaxApplicableDiscount(item);

  return calculateTotalWithDiscount(price, item.quantity, discount);
};

/**
 * 장바구니 총액 계산 (쿠폰 적용)
 * @param {CartItemType[]} cart - 장바구니
 * @param {Coupon | null} selectedCoupon - 선택된 쿠폰
 * @returns {object} - 총액 (할인 전, 후, 할인 금액)
 */
export const calculateCartTotal = (cart: CartItemType[], selectedCoupon: CouponType | null) => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  // 각 아이템에 대해 총액을 계산
  cart.forEach((item) => {
    const itemTotal = calculateItemTotal(item);
    // 할인 전 총액
    totalBeforeDiscount += item.product.price * item.quantity;
    // 할인 후 총액
    totalAfterDiscount += itemTotal;
  });

  let totalDiscount = totalBeforeDiscount - totalAfterDiscount;

  // 쿠폰 적용
  if (selectedCoupon) {
    const { discountType, discountValue } = selectedCoupon;

    // 쿠폰이 금액 할인일 경우
    if (discountType === 'amount') {
      totalAfterDiscount = Math.max(0, totalAfterDiscount - discountValue);
    } else {
      // 퍼센트 할인일 경우
      totalAfterDiscount *= 1 - discountValue / 100;
    }

    totalDiscount = totalBeforeDiscount - totalAfterDiscount;
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
    totalDiscount: Math.round(totalDiscount),
  };
};

/**
 * 장바구니 아이템 수량 업데이트 (수량이 0이면 항목 제거)
 * @param {CartItem[]} cart - 장바구니
 * @param {string} productId - 상품 ID
 * @param {number} newQuantity - 새 수량
 * @returns {CartItem[]} - 업데이트된 장바구니
 */
export const updateCartItemQuantity = (
  cart: CartItemType[],
  productId: string,
  newQuantity: number,
): CartItemType[] =>
  cart.reduce((updatedCart, item) => {
    if (item.product.id === productId) {
      const updatedQuantity = Math.max(0, Math.min(newQuantity, item.product.stock));
      if (updatedQuantity > 0) {
        updatedCart.push({ ...item, quantity: updatedQuantity });
      }
    } else {
      updatedCart.push(item);
    }
    return updatedCart;
  }, [] as CartItemType[]);

/**
 * 최대 할인율 계산
 * @param {CartItemType} item - 장바구니 아이템
 * @returns {number} - 최대 할인율
 */
export const getMaxApplicableDiscount = (item: CartItemType): number => {
  const { discounts } = item.product;
  return discounts.reduce(
    (maxDiscount, discount: DiscountType) =>
      item.quantity >= discount.quantity ? Math.max(maxDiscount, discount.rate) : maxDiscount,
    0,
  );
};
