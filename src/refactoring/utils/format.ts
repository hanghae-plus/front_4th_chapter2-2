export const formatPrice = (price: number): string => {
  return price.toLocaleString('ko-KR');
};

export const formatDiscountRate = (rate: number): string => {
  return `${(rate * 100).toFixed(0)}%`;
};
