import { Coupon } from '../../../../types';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateCoupon = (coupon: Coupon): ValidationResult => {
  const errors: string[] = [];

  if (!coupon.name.trim()) {
    errors.push('쿠폰 이름은 필수입니다');
  } else if (coupon.name.length < 2) {
    errors.push('쿠폰 이름은 2글자 이상이어야 합니다');
  }

  if (!coupon.code.trim()) {
    errors.push('쿠폰 코드는 필수입니다');
  } else if (!/^[A-Z0-9]+$/.test(coupon.code)) {
    errors.push('쿠폰 코드는 영문 대문자와 숫자만 가능합니다');
  }

  if (coupon.discountValue < 0) {
    errors.push('할인 값은 0 이상이어야 합니다');
  }

  if (coupon.discountType === 'percentage') {
    if (coupon.discountValue > 100) {
      errors.push('할인율은 100% 이하여야 합니다');
    }
  } else if (coupon.discountType === 'amount') {
    if (coupon.discountValue > 1000000) {
      errors.push('할인 금액은 1,000,000원 이하여야 합니다');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
