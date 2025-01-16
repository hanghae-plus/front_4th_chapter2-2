import { CartItem } from '../../types';
import { clamp } from '../lib';

export const calculateCartTotal = (cart: CartItem[]) => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  // 벌크 할인가 계산
  cart.forEach(({ product, quantity }) => {
    totalBeforeDiscount += product.price * quantity;
    totalAfterDiscount += calculateItemTotal({ product, quantity });
  });

  // // 쿠폰 적용
  // if (selectedCoupon) {
  //   if (selectedCoupon.discountType === 'amount') {
  //     totalAfterDiscount = Math.max(0, totalAfterDiscount - selectedCoupon.discountValue);
  //   }

  //   if (selectedCoupon.discountType === 'percentage') {
  //     totalAfterDiscount = totalAfterDiscount * (1 - selectedCoupon.discountValue / 100);
  //   }
  // }

  const totalDiscount = totalBeforeDiscount - totalAfterDiscount;

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
    totalDiscount: Math.round(totalDiscount),
  };
};

export const calculateItemTotal = ({ product, quantity }: CartItem) => {
  const totalPrice = product.price * quantity;
  const discountRate = getMaxApplicableDiscount({ product, quantity });

  return totalPrice * (1 - discountRate);
};

export const getMaxApplicableDiscount = ({ product, quantity }: CartItem) => {
  return product.discounts.reduce((acc, current) => {
    return current.quantity <= quantity && current.rate > acc ? current.rate : acc;
  }, 0);
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number,
): CartItem[] => {
  const updatedCart = cart.reduce((acc, current) => {
    // 장바구니에 같은 상품이 존재할 떄
    if (current.product.id === productId) {
      const minQuantity = 0;
      const maxQuantity = current.product.stock;
      const updatedQuantity = clamp(newQuantity, minQuantity, maxQuantity);
      return updatedQuantity > 0 ? [...acc, { ...current, quantity: updatedQuantity }] : acc;
    }

    return [...acc, current];
  }, [] as CartItem[]);

  return updatedCart;
};
