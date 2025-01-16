/**
 * 백분율을 소수로 변환 (e.g., 10% -> 0.1)
 */
export const fromPercentage = (percentage: number): number => {
  if (isNegativeNumber(percentage)) {
    throw new Error('백분율은 0 이상의 숫자여야 합니다.');
  }

  return percentage === 0 ? percentage : percentage / 100;
};

/**
 * 값이 음수인지 확인
 */
export const isNegativeNumber = (value: number): boolean => value < 0;

/**
 * 주어진 금액에 비율을 적용
 */
export const applyRate = (amount: number, rate: number): number =>
  amount * (1 - Math.min(Math.max(rate, 0), 1));
