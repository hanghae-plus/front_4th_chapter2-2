import { Product, CartItem, Coupon } from '../../types';
import { calculateItemTotal } from './discount';

// 항목의 남은 재고 확인
export const calculateRemainingStock = (cart: CartItem[], product: Product) => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  return product.stock - (cartItem?.quantity || 0);
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
    return total + calculateItemTotal(item);
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

// 장바구니에 담긴 항목의 할인 적용 값 계산
export const getAppliedDiscount = (item: CartItem) => {
  const { discounts } = item.product;
  const { quantity } = item;
  let appliedDiscount = 0;
  for (const discount of discounts) {
    if (quantity >= discount.quantity) {
      appliedDiscount = Math.max(appliedDiscount, discount.rate);
    }
  }
  return appliedDiscount;
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
