import { CartItem, Coupon } from '../../types';

//할인 없이 총액을 계산해야 한다.
//수량에 따라 올바른 할인을 적용해야 한다.
export const calculateItemTotal = (item: CartItem) => {
  const maxDiscount = getMaxApplicableDiscount(item);
  return item.product.price * item.quantity - item.product.price * item.quantity * maxDiscount;
};

//적용 가능한 가장 높은 할인율을 반환해야 한다.
//할인이 적용되지 않으면 0을 반환해야 한다.
export const getMaxApplicableDiscount = (item: CartItem) => {
  const applicableDiscounts = item.product.discounts
    .filter((discount) => discount.quantity <= item.quantity)
    .sort((a, b) => b.rate - a.rate);
  return applicableDiscounts.length > 0 ? applicableDiscounts[0].rate : 0;
};

//쿠폰 없이 총액을 올바르게 계산해야 한다.
//금액쿠폰을 올바르게 적용해야 한다.
//퍼센트 쿠폰을 올바르게 적용해야 한다.
export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null) => {
  const totalBeforeDiscount = cart.reduce((sum, item) => sum + calculateItemTotal(item), 0);

  const totalDiscount = selectedCoupon
    ? Math.min(
        selectedCoupon.discountType === 'percentage'
          ? totalBeforeDiscount * (selectedCoupon.discountValue / 100)
          : selectedCoupon.discountValue,
      )
    : 0;

  return {
    totalBeforeDiscount,
    totalAfterDiscount: totalBeforeDiscount - totalDiscount,
    totalDiscount,
  };
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number,
): CartItem[] => {
  return [];
};
