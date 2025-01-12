import { CartItem, Coupon } from "../../types";

const calculateOriginalTotal = (item: CartItem) => {
  return item.product.price * item.quantity;
};

const calculateCouponDiscount = (totalPrice: number, coupon: Coupon | null) => {
  if (!coupon) return totalPrice;

  if (coupon.discountType === "amount") {
    return Math.max(0, totalPrice - coupon.discountValue);
  } else {
    return totalPrice * (1 - coupon.discountValue / 100);
  }
};

/**
 * 아이템의 총 가격을 계산하는 함수
 * product의 discounts 중 가장 큰 할인을 적용한다.
 */
export const calculateItemTotal = (item: CartItem) => {
  const maxDiscount = getMaxApplicableDiscount(item);
  return item.product.price * item.quantity * (1 - maxDiscount);
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  const maxDiscount = item.product.discounts.reduce((maxDiscount, d) => {
    return item.quantity >= d.quantity && d.rate > maxDiscount
      ? d.rate
      : maxDiscount;
  }, 0);
  return maxDiscount;
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  const totalBeforeDiscount = cart.reduce((total, item) => {
    return total + calculateOriginalTotal(item);
  }, 0);
  const totalAfterProductDiscount = cart.reduce((total, item) => {
    return total + calculateItemTotal(item);
  }, 0);
  const totalAfterDiscount = calculateCouponDiscount(
    totalAfterProductDiscount,
    selectedCoupon
  );

  const totalDiscount = totalBeforeDiscount - totalAfterDiscount;

  return {
    totalBeforeDiscount,
    totalAfterDiscount,
    totalDiscount,
  };
};

/**
 * newQuantity로 수량이 업데이트된 cart를 반환하길 원함
 * 만약 cart에 없는
 * 1. newQuantity가 0인 경우
 * - 해당 아이템을 제거한다.
 * 2. 기존 아이템이 있는 경우(이건 cart에 추가해서 오기에 신경 쓰지 않아도 된다)
 * 3.
 */
export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  const cartCopy = [...cart];
  if (newQuantity === 0) {
    return cartCopy.filter((item) => item.product.id !== productId);
  }
  const findItem = cartCopy.find((item) => item.product.id === productId);
  if (!findItem) return cartCopy;

  if (newQuantity > findItem.product.stock) {
    findItem.quantity = findItem.product.stock;
  } else {
    findItem.quantity = newQuantity;
  }

  return cartCopy;
};
