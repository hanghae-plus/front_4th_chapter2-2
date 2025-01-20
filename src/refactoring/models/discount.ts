import { CartItem } from 'src/types';

// 개별 항목에서 적용 가능한 최대 할인율 계산
export const calculateItemMaxDiscount = (item: CartItem) => {
  const discount = item.product.discounts.reduce((maxDiscount, d) => {
    return item.quantity >= d.quantity && d.rate > maxDiscount ? d.rate : maxDiscount;
  }, 0);
  return discount;
};

// 개별 항목의 할인율 적용한 총 금액 계산
export const calculateItemTotal = (item: CartItem) => {
  const { product, quantity } = item;
  const discount = calculateItemMaxDiscount(item);
  return product.price * quantity * (1 - discount);
};

// 항목의 최대 할인율
export const calculateMaxDiscount = (discounts: { quantity: number; rate: number }[]) => {
  return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0);
};
