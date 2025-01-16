import { CartItem, Coupon } from "../../types";

// 할인 없이 총액 계산
export const calculateItemTotal = (item: CartItem) => {
  return item.quantity * item.product.price * (1 - getMaxApplicableDiscount(item));
};

// 할인율 계산해주는 함수
export const getMaxApplicableDiscount = (item: CartItem) => {
  const qty = item.quantity;
  const discounts = item.product.discounts;
  let discountRate = 0;
  for (let i = 0; i < discounts.length; i++) {
    if (qty >= discounts[i].quantity) {
      discountRate = discounts[i].rate;
    } else {
      break;
    }
  }
  return discountRate;
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;
  
  cart.forEach(item => {
    const { price } = item.product;
    const { quantity } = item;
    totalBeforeDiscount += price * quantity;
    
    const discount = item.product.discounts.reduce((maxDiscount, d) => {
      return quantity >= d.quantity && d.rate > maxDiscount ? d.rate : maxDiscount;
    }, 0);
    
    totalAfterDiscount += price * quantity * (1 - discount);
  });
  
  let totalDiscount = totalBeforeDiscount - totalAfterDiscount;
  
  // 쿠폰 적용
  if (selectedCoupon) {
    if (selectedCoupon.discountType === 'amount') {
      totalAfterDiscount = Math.max(0, totalAfterDiscount - selectedCoupon.discountValue);
    } else {
      totalAfterDiscount *= (1 - selectedCoupon.discountValue / 100);
    }
    totalDiscount = totalBeforeDiscount - totalAfterDiscount;
  }
  
  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
    totalDiscount: Math.round(totalDiscount)
  };
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  return cart.map(item => {
    if (item.product.id === productId) {
      const maxQuantity = item.product.stock;
      const updatedQuantity = Math.max(0, Math.min(newQuantity, maxQuantity));
      return updatedQuantity > 0 ? { ...item, quantity: updatedQuantity } : null;
    }
    return item;
  }).filter((item): item is CartItem => item !== null)
};
