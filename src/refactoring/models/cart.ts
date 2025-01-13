import { CartItem, Coupon } from '../../types';

/**
 * 한 종류의 상품 가격을 수량과 함께 계산하는 함수
 * - 할인 적용 가능 시 최대 할인 적용하여 계산
 */
export const calculateItemTotal = (item: CartItem) => {
  const { product, quantity } = item;

  // 할인 가능 시 최대 할인 적용하여 계산
  const maxApplicableDiscount = getMaxApplicableDiscount(item);
  if (maxApplicableDiscount > 0) {
    const discountedAmount = product.price * (1 - maxApplicableDiscount);
    return discountedAmount * quantity;
  }

  return product.price * quantity;
};

/**
 * 최대 할인율을 계산하는 함수
 */
export const getMaxApplicableDiscount = (item: CartItem) => {
  const { product, quantity } = item;

  return product.discounts
    .filter((discount) => quantity >= discount.quantity)
    .reduce((max, discount) => Math.max(max, discount.rate), 0);
};

export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null) => {
  const totalBeforeDiscount = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  const totalAfterDiscount = cart.reduce((total, item) => total + calculateItemTotal(item), 0);

  if (!selectedCoupon) {
    return {
      totalBeforeDiscount,
      totalAfterDiscount,
      totalDiscount: totalBeforeDiscount - totalAfterDiscount,
    };
  }

  let couponDiscount = 0;
  if (selectedCoupon?.discountType === 'amount') {
    couponDiscount = selectedCoupon.discountValue;
  } else if (selectedCoupon?.discountType === 'percentage') {
    couponDiscount = totalAfterDiscount * (selectedCoupon.discountValue / 100);
  }
  return {
    totalBeforeDiscount,
    totalAfterDiscount: totalAfterDiscount - couponDiscount,
    totalDiscount: totalBeforeDiscount - totalAfterDiscount + couponDiscount,
  };
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number,
): CartItem[] =>
  cart
    .map((item) => {
      if (item.product.id === productId) {
        const maxStock = item.product.stock || Infinity;
        const updatedQuantity = Math.min(newQuantity, maxStock);
        return updatedQuantity > 0 ? { ...item, quantity: updatedQuantity } : null;
      }
      return item;
    })
    .filter((item) => item !== null) as CartItem[];
