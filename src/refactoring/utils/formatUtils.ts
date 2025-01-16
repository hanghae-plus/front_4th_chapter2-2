
/**
 * 할인율을 백분율 문자열로 변환
 * Ex: 0.15 -> "15%"
 * @param discountRate  - 소수점 형태의 할인율 (예: 0.15는 15%를 의미).
 * @returns {string} - 백분율 문자열로 변환된 할인율 (예: "15%").
 */
export const formatDiscountPercentage = (discountRate: number): string => {
    return `${(discountRate * 100).toFixed(0)}%`;
  };