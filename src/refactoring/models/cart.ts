import { CartItem, Coupon } from '../../types';

//할인 없이 총액을 계산해야 한다.
//수량에 따라 올바른 할인을 적용해야 한다.
export const calculateItemTotal = (item: CartItem) => {
  const maxDiscount = getMaxApplicableDiscount(item);
  console.log('333', maxDiscount);
  return item.product.price * item.quantity - item.product.price * item.quantity * maxDiscount;
};

//적용 가능한 가장 높은 할인율을 반환해야 한다.
//할인이 적용되지 않으면 0을 반환해야 한다.
export const getMaxApplicableDiscount = (item: CartItem) => {
  const maxDiscount = item.product.discounts.find((discount) => discount.quantity <= item.quantity);
  //find로 작성하면 조건을 만족하는 가장 첫번째 요소 반환하기 때문에 0.2가 나와야하는게 0.1이 나옴
  return maxDiscount ? maxDiscount.rate : 0;
};

export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null) => {
  return {
    totalBeforeDiscount: 0,
    totalAfterDiscount: 0,
    totalDiscount: 0,
  };
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number,
): CartItem[] => {
  return [];
};
