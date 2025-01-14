import { CartItem, Coupon } from '../../types';

// 개별 항목의 총 금액 계산
// 테스트 코드를 보니까 할인율까지 적용한 총 금액이네
export const calculateItemTotal = (item: CartItem) => {
  const { product, quantity } = item;
  const discount = getMaxApplicableDiscount(item);
  return product.price * quantity * (1 - discount);
};

// 개별 항목에서 적용 가능한 최대 할인율 계산
export const getMaxApplicableDiscount = (item: CartItem) => {
  const discount = item.product.discounts.reduce((maxDiscount, d) => {
    return item.quantity >= d.quantity && d.rate > maxDiscount ? d.rate : maxDiscount;
  }, 0);
  return discount;
};

// 장바구니 전체 금액 및 할인 계산
export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null) => {
  // 할인 적용 전 총 금액 계산
  const totalBeforeDiscount = cart.reduce((total, item) => {
    const { product, quantity } = item;
    return total + product.price * quantity;
  }, 0);

  // 할인 적용 후 총 금액 계산
  let totalAfterDiscount = cart.reduce((total, item) => {
    const { product, quantity } = item;
    const discount = getMaxApplicableDiscount(item);
    return total + product.price * quantity * (1 - discount);
  }, 0);

  // 총 할인 금액 계산
  let totalDiscount = totalBeforeDiscount - totalAfterDiscount;

  // 쿠폰 적용
  if (selectedCoupon != null) {
    if (selectedCoupon.discountType === 'amount') {
      totalAfterDiscount = Math.max(0, totalAfterDiscount - selectedCoupon.discountValue);
    } else {
      totalAfterDiscount *= 1 - selectedCoupon.discountValue / 100;
    }
    return {
      totalBeforeDiscount: Math.round(totalBeforeDiscount),
      totalAfterDiscount: Math.round(totalAfterDiscount),
      totalDiscount: Math.round(totalBeforeDiscount - totalAfterDiscount),
    };
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
    totalDiscount: Math.round(totalDiscount),
  };
};

// 장바구니 항목의 수량 업데이트
export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number,
): CartItem[] => {
  return cart
    .map((item) => {
      if (item.product.id === productId) {
        const maxQuantity = item.product.stock;
        const updatedQuantity = Math.max(0, Math.min(newQuantity, maxQuantity));
        return updatedQuantity > 0 ? { ...item, quantity: updatedQuantity } : null;
      }
      return item;
    })
    .filter((item): item is CartItem => item !== null);
};
